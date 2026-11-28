import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY, C, FLOOR_Y } from "./constants";
import { FOG_FN, VERT_WORLD } from "./glsl";
import { ClassicalMaleBust } from "./ClassicalBust";
import { MuseumModel } from "./MuseumModel";
import {
  makeAstrolabeTubeGridGeo,
  makeClassicalBalusterPlinthGeo,
  makeOvalCartoucheGeo,
} from "./sculptedGeometries";
import type { ScrollState } from "../lib/useScroll";
import type { OpsModuleId, SpatialWorldState } from "../lib/spatialWorld";

const NICHES = [
  { key: "barber", label: "I · BARBER", pos: [-14.4, FLOOR_Y, -158] as [number, number, number], ry: Math.PI / 2, side: -1 },
  { key: "hair", label: "II · HAIR ATELIER", pos: [14.4, FLOOR_Y, -176] as [number, number, number], ry: -Math.PI / 2, side: 1 },
  { key: "spa", label: "III · SPA SANCTUARY", pos: [-14.4, FLOOR_Y, -198] as [number, number, number], ry: Math.PI / 2, side: -1 },
  { key: "cosmetology", label: "IV · COSMETOLOGY", pos: [14.4, FLOOR_Y, -216] as [number, number, number], ry: -Math.PI / 2, side: 1 },
  { key: "nails", label: "V · NAIL STUDIO", pos: [-14.4, FLOOR_Y, -238] as [number, number, number], ry: Math.PI / 2, side: -1 },
  { key: "browsLashes", label: "VI · BROWS & LASHES", pos: [14.4, FLOOR_Y, -252] as [number, number, number], ry: -Math.PI / 2, side: 1 },
] as const;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function makeClassicalStoneMat(baseHex: number, veinStrength = 0.07): THREE.ShaderMaterial {
  const c = new THREE.Color(baseHex);
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uBase: { value: c },
      uVein: { value: veinStrength },
      uFogCol: { value: ALABASTER_FOG },
      uFogDen: { value: ALABASTER_FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNorm = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * wp;
        vZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform vec3 uBase;
      uniform float uVein;
      varying vec3 vWorld;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        vec3 sunDir = normalize(vec3(0.35, 0.88, 0.32));
        float ndl = max(dot(normalize(vNorm), sunDir), 0.0);
        float hemi = 0.68 + 0.32 * ndl;
        float vein = sin(vWorld.x * 0.65 + vWorld.y * 0.95 + sin(vWorld.z * 0.42) * 2.1) * 0.5 + 0.5;
        vec3 col = uBase * hemi * (1.0 - vein * uVein);
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }
    `,
  });
}

function makeFlutedPlinthMat(baseHex: number, veinStrength = 0.06): THREE.ShaderMaterial {
  const c = new THREE.Color(baseHex);
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uBase: { value: c },
      uVein: { value: veinStrength },
      uPulse: { value: 0 },
      uTime: { value: 0 },
      uFogCol: { value: ALABASTER_FOG },
      uFogDen: { value: ALABASTER_FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      uniform float uPulse;
      uniform float uTime;
      varying vec3 vWorld;
      varying vec3 vLocal;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        vLocal = position;
        float collarZone = smoothstep(0.16, 0.25, position.y) * (1.0 - smoothstep(0.76, 0.86, position.y));
        float wave = sin(position.y * 14.0 - uTime * 3.5) * 0.045 * uPulse * collarZone;
        vec3 displaced = position + normal * wave;

        vec4 wp = modelMatrix * vec4(displaced, 1.0);
        vWorld = wp.xyz;
        vNorm = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * wp;
        vZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform vec3 uBase;
      uniform float uVein;
      uniform float uPulse;
      varying vec3 vWorld;
      varying vec3 vLocal;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        float theta = atan(vLocal.z, vLocal.x);
        float shaftMask = smoothstep(0.17, 0.22, vLocal.y) * (1.0 - smoothstep(0.77, 0.83, vLocal.y));
        float flutes = sin(theta * 20.0) * shaftMask;

        vec3 n = normalize(vNorm + vec3(-sin(theta) * flutes * 0.16, 0.0, cos(theta) * flutes * 0.16));
        vec3 sunDir = normalize(vec3(0.35, 0.88, 0.32));
        float ndl = max(dot(n, sunDir), 0.0);
        float hemi = 0.67 + 0.33 * ndl;
        float fluteShadow = 1.0 - (0.5 - 0.5 * flutes) * 0.08 * shaftMask;

        float vein = sin(vWorld.x * 0.65 + vWorld.y * 0.95 + sin(vWorld.z * 0.42) * 2.1) * 0.5 + 0.5;
        vec3 col = uBase * hemi * fluteShadow * (1.0 - vein * uVein);
        col += vec3(0.18, 0.14, 0.06) * uPulse * shaftMask;
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }
    `,
  });
}

function makePlaqueTexture(title: string, subtitle: string, anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#efe8dc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#8c6d46";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(24, 24, canvas.width - 48, canvas.height - 48, 148);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = '600 40px "JetBrains Mono", monospace';
    ctx.fillStyle = "#7a5b34";
    ctx.fillText(title, 512, 155);

    ctx.font = 'italic 500 64px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = "#1c1917";
    ctx.fillText(subtitle, 512, 265);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = Math.min(8, anisotropy);
  tex.needsUpdate = true;
  return tex;
}

function makeFloorClockTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 1024;
    const cy = 1024;
    ctx.fillStyle = "#f2ece1";
    ctx.fillRect(0, 0, 2048, 2048);

    ctx.strokeStyle = "#8c6d46";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 940, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 740, 0, Math.PI * 2);
    ctx.stroke();

    const romans = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    ctx.fillStyle = "#1c1917";
    ctx.font = '600 104px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const rx = cx + Math.cos(ang) * 840;
      const ry = cy + Math.sin(ang) * 840;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(ang + Math.PI / 2);
      ctx.fillText(romans[i], 0, 0);
      ctx.restore();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = Math.min(8, anisotropy);
  tex.needsUpdate = true;
  return tex;
}

function NicheSculpture({ kind }: { kind: (typeof NICHES)[number]["key"] }) {
  if (kind === "barber") {
    return <ClassicalMaleBust position={[0, 3.25, 0.25]} height={3.0} />;
  }
  if (kind === "hair") {
    return <MuseumModel name="ornate_mirror_01" finish="bronze" position={[0, 3.25, 0.2]} height={3.0} />;
  }
  if (kind === "spa") {
    return <MuseumModel name="antique_ceramic_vase_01" finish="marble" position={[0, 3.25, 0.2]} height={2.7} />;
  }
  if (kind === "cosmetology") {
    return <MuseumModel name="brass_vase_01" finish="bronze" position={[0, 3.25, 0.2]} height={2.7} />;
  }
  if (kind === "nails") {
    return <MuseumModel name="brass_goblets" finish="bronze" position={[0, 3.25, 0.2]} height={2.0} />;
  }
  return (
    <MuseumModel
      name="seadogs_compass"
      finish="bronze"
      position={[0, 3.35, 0.25]}
      rotation={[0.35, 0, 0]}
      height={1.65}
    />
  );
}

/**
 * Suspended golden-bronze Pantheon Astrolabe Halo above the Master Chair:
 * smoothly morphs on GPU between Horologium celestial orbit (uMode = 0)
 * and Balanced 3-lobed Thesaurus Equilibrium Crown (uMode = 1).
 */
function PantheonAstrolabeHalo({
  scroll,
  world,
  reduced,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  reduced: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const modeVal = useRef(0);

  const { geo, mat } = useMemo(() => {
    const g = makeAstrolabeTubeGridGeo(160, 12);
    const m = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uMode: { value: 0 },
        uOpen: { value: 0 },
        uTime: { value: 0 },
        uFogCol: { value: ALABASTER_FOG },
        uFogDen: { value: ALABASTER_FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        uniform float uMode;
        uniform float uOpen;
        uniform float uTime;
        varying vec3 vNorm;
        varying vec3 vViewDir;
        varying float vZ;

        vec3 evalCurve(float u, float mode, float open) {
          // State A: Inclined Horologium Celestial Double-Loop
          float thA = u * 12.5663706;
          vec3 pA = vec3(
            cos(thA) * 3.4,
            0.85 * sin(thA * 1.5),
            sin(thA) * 3.4
          );

          // State B: Balanced 3-lobed Renaissance Treasury Laurel Crown
          float thB = u * 6.2831853;
          float radB = 3.5 * (1.0 + 0.18 * cos(3.0 * thB));
          vec3 pB = vec3(
            cos(thB) * radB,
            0.42 * sin(3.0 * thB),
            sin(thB) * radB
          );

          return mix(pA, pB, mode) * (0.65 + 0.35 * open);
        }

        void main() {
          float u = position.x;
          float v = position.y;
          float eps = 0.0025;

          vec3 center = evalCurve(u, uMode, uOpen);
          vec3 nextP = evalCurve(u + eps, uMode, uOpen);
          vec3 tangent = normalize(nextP - center);
          vec3 upVec = abs(tangent.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
          vec3 binorm = normalize(cross(tangent, upVec));
          vec3 norm = normalize(cross(binorm, tangent));

          float tubePhi = v * 6.2831853;
          float tubeR = 0.068 * (0.4 + 0.6 * uOpen);
          vec3 offsetDir = cos(tubePhi) * norm + sin(tubePhi) * binorm;
          vec3 localPos = center + offsetDir * tubeR;

          vec4 wp = modelMatrix * vec4(localPos, 1.0);
          vNorm = normalize(mat3(modelMatrix) * offsetDir);
          vViewDir = normalize(cameraPosition - wp.xyz);
          vec4 mv = viewMatrix * wp;
          vZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        varying vec3 vNorm;
        varying vec3 vViewDir;
        varying float vZ;
        void main() {
          vec3 n = normalize(vNorm);
          vec3 v = normalize(vViewDir);
          vec3 sun = normalize(vec3(0.35, 0.90, 0.30));
          float ndl = max(dot(n, sun), 0.0);
          vec3 h = normalize(sun + v);
          float spec = pow(max(dot(n, h), 0.0), 34.0) * 0.45;
          float rim = pow(1.0 - max(dot(n, v), 0.0), 2.5) * 0.16;
          vec3 bronze = vec3(0.62, 0.48, 0.29) * (0.64 + 0.38 * ndl) + vec3(0.95, 0.85, 0.60) * (spec + rim);
          gl_FragColor = vec4(applyFog(bronze, vZ), 1.0);
        }
      `,
    });
    return { geo: g, mat: m };
  }, []);

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  useFrame((state, delta) => {
    const p = scroll.current?.smooth ?? 0;
    const t = state.clock.elapsedTime;
    const mod = world.current?.selectedOpsModule ?? "requests";
    const targetMode = mod === "register" || mod === "crm" ? 1.0 : 0.0;
    modeVal.current += (targetMode - modeVal.current) * Math.min(1, delta * 2.8);

    mat.uniforms.uMode.value = modeVal.current;
    mat.uniforms.uOpen.value = reduced ? 1 : smoothstep(0.56, 0.66, p);
    mat.uniforms.uTime.value = t;

    if (meshRef.current && !reduced) {
      meshRef.current.rotation.y += delta * 0.09;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      material={mat}
      position={[0, 7.2, 0]}
      frustumCulled={false}
    />
  );
}

/**
 * Dimension 2 — Enclosed Vatican "Braccio Nuovo" Renaissance Gallery,
 * Pantheon Oculus Rotunda, & Semicircular Marble Apse (Zero Flatworld).
 */
export function PostPortalWorld({
  scroll,
  world,
  reduced = false,
  onSelectCategory,
  onOpenConnect,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  reduced?: boolean;
  onSelectCategory?: (key: string) => void;
  onOpenConnect?: () => void;
}) {
  const { gl } = useThree();
  const maxAniso = gl.capabilities.getMaxAnisotropy();

  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const nicheMatRefs = useRef<(THREE.Group | null)[]>([]);
  const opsMatRefs = useRef<(THREE.Group | null)[]>([]);
  const nichePulseRef = useRef<number[]>(NICHES.map(() => 0));
  const opsPulseRef = useRef<number[]>([0, 0]);

  const {
    floorMat,
    vaultMat,
    wallMat,
    carraraMat,
    travertineMat,
    bronzeMat,
    flutedCarraraMat,
    nichePlinthMats,
    opsPlinthMats,
    plinthGeo,
    cartoucheGeo,
    plaqueTextures,
    clockTex,
    friezeTex,
    watchPlaqueTex,
    registerPlaqueTex,
    pilasterZ,
  } = useMemo(() => {
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        uFogCol: { value: ALABASTER_FOG },
        uFogDen: { value: ALABASTER_FOG_DENSITY },
      },
      vertexShader: VERT_WORLD,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        varying vec3 vP;
        varying float vZ;
        void main() {
          vec2 p = vP.xy;
          vec2 tile = floor(vec2(p.x * 0.30, p.y * 0.22));
          float checker = mod(tile.x + tile.y, 2.0);
          float gx = smoothstep(0.03, 0.0, min(fract(p.x * 0.30), 1.0 - fract(p.x * 0.30)));
          float gz = smoothstep(0.03, 0.0, min(fract(p.y * 0.22), 1.0 - fract(p.y * 0.22)));
          float vein = sin(p.x * 0.8 + sin(p.y * 0.32) * 2.0) * 0.024;

          vec3 travA = vec3(0.92, 0.88, 0.82) + vein;
          vec3 travB = vec3(0.86, 0.81, 0.74) - vein;
          vec3 col = mix(travA, travB, checker);
          col *= 1.0 - (gx + gz) * 0.10;

          float runner = smoothstep(5.6, 5.2, abs(p.x));
          vec3 runnerCol = vec3(0.95, 0.92, 0.87) + vein * 0.5;
          col = mix(col, runnerCol, runner * 0.45);
          float trim = smoothstep(0.08, 0.0, abs(abs(p.x) - 5.4))
                     + smoothstep(0.07, 0.0, abs(abs(p.x) - 11.4));
          col = mix(col, vec3(0.55, 0.43, 0.27), clamp(trim * 0.65, 0.0, 0.75));

          float skyPool = 0.5 + 0.5 * cos(p.y * 0.16);
          col *= 0.92 + 0.12 * skyPool;

          gl_FragColor = vec4(applyFog(col, vZ), 1.0);
        }
      `,
    });

    const vMat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uFogCol: { value: ALABASTER_FOG },
        uFogDen: { value: ALABASTER_FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorld;
        varying float vZ;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz;
          vec4 mv = viewMatrix * wp;
          vZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        varying vec2 vUv;
        varying vec3 vWorld;
        varying float vZ;
        void main() {
          float cu = fract(vWorld.z * 0.085);
          float cv = fract(vUv.x * 7.0);
          float border = min(min(cu, 1.0 - cu), min(cv, 1.0 - cv));
          float recess = smoothstep(0.14, 0.22, border);
          float bronzeRim = smoothstep(0.16, 0.12, abs(border - 0.14));

          float crown = smoothstep(3.8, 0.8, abs(vWorld.x));
          float skylight = crown * smoothstep(0.24, 0.30, border);

          vec3 stone = mix(vec3(0.91, 0.87, 0.80), vec3(0.80, 0.74, 0.66), recess * 0.65);
          stone = mix(stone, vec3(0.62, 0.49, 0.32), bronzeRim * 0.42);
          stone = mix(stone, vec3(0.99, 0.97, 0.93), skylight * 0.92);

          gl_FragColor = vec4(applyFog(stone, vZ), 1.0);
        }
      `,
    });

    const wMat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uFogCol: { value: ALABASTER_FOG },
        uFogDen: { value: ALABASTER_FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorld;
        varying float vZ;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz;
          vec4 mv = viewMatrix * wp;
          vZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        varying vec3 vWorld;
        varying float vZ;
        void main() {
          float y = vWorld.y;
          vec3 dado = vec3(0.80, 0.74, 0.66);
          vec3 upper = vec3(0.90, 0.86, 0.79);
          vec3 col = mix(dado, upper, smoothstep(-3.2, -3.0, y));
          float rail = smoothstep(0.16, 0.0, abs(y + 3.1));
          float cornice = smoothstep(0.24, 0.0, abs(y - 12.6));
          col = mix(col, vec3(0.56, 0.44, 0.28), clamp(rail + cornice, 0.0, 0.8));
          gl_FragColor = vec4(applyFog(col, vZ), 1.0);
        }
      `,
    });

    const pTexts = NICHES.map((n) => {
      const [num, name] = n.label.split(" · ");
      return makePlaqueTexture(num, name, maxAniso);
    });

    const pZ = [-118, -138, -158, -176, -198, -216, -238, -252, -268, -328, -352, -378, -404];

    return {
      floorMat: fMat,
      vaultMat: vMat,
      wallMat: wMat,
      carraraMat: makeClassicalStoneMat(C.CARRARA, 0.06),
      travertineMat: makeClassicalStoneMat(C.TRAVERTINE, 0.08),
      bronzeMat: makeClassicalStoneMat(C.BRONZE, 0.03),
      flutedCarraraMat: makeFlutedPlinthMat(C.CARRARA, 0.06),
      nichePlinthMats: NICHES.map(() => makeFlutedPlinthMat(C.CARRARA, 0.06)),
      opsPlinthMats: [makeFlutedPlinthMat(C.CARRARA, 0.06), makeFlutedPlinthMat(C.CARRARA, 0.06)],
      plinthGeo: makeClassicalBalusterPlinthGeo(36),
      cartoucheGeo: makeOvalCartoucheGeo(1, 1),
      plaqueTextures: pTexts,
      clockTex: makeFloorClockTexture(maxAniso),
      friezeTex: makePlaqueTexture("ANNO MMXXVI // UZBEKISTAN", "SMARTCHAIR ATELIER", maxAniso),
      watchPlaqueTex: makePlaqueTexture("HOROLOGIUM", "Live Scheduling", maxAniso),
      registerPlaqueTex: makePlaqueTexture("THESAURUS", "Checkout & Z-Reports", maxAniso),
      pilasterZ: pZ,
    };
  }, [maxAniso]);

  useEffect(() => {
    return () => {
      plaqueTextures.forEach((t) => t.dispose());
      clockTex.dispose();
      friezeTex.dispose();
      watchPlaqueTex.dispose();
      registerPlaqueTex.dispose();
      floorMat.dispose();
      vaultMat.dispose();
      wallMat.dispose();
      carraraMat.dispose();
      travertineMat.dispose();
      bronzeMat.dispose();
      flutedCarraraMat.dispose();
      nichePlinthMats.forEach((m) => m.dispose());
      opsPlinthMats.forEach((m) => m.dispose());
      plinthGeo.dispose();
      cartoucheGeo.dispose();
    };
  }, [
    plaqueTextures,
    clockTex,
    friezeTex,
    watchPlaqueTex,
    registerPlaqueTex,
    floorMat,
    vaultMat,
    wallMat,
    carraraMat,
    travertineMat,
    bronzeMat,
    flutedCarraraMat,
    nichePlinthMats,
    opsPlinthMats,
    plinthGeo,
    cartoucheGeo,
  ]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current?.smooth ?? 0;

    // Scroll-driven sculptural emergence + gentle selection pulse across the 6 Gallery Bays
    nicheMatRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const niche = NICHES[idx];
      const pStart = 0.35 + idx * 0.026;
      const emerge = reduced ? 1 : smoothstep(pStart, pStart + 0.085, p);

      grp.position.y = FLOOR_Y - (1 - emerge) * 2.1;
      grp.rotation.y = niche.ry + (1 - emerge) * 0.36 * niche.side;

      const isSelected = world.current?.selectedCategory === niche.key;
      const targetS = isSelected ? 1.045 : 1.0;
      grp.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1);

      const targetPulse = isSelected ? 0.38 : 0.0;
      nichePulseRef.current[idx] += (targetPulse - nichePulseRef.current[idx]) * Math.min(1, delta * 3.5);
      nichePlinthMats[idx].uniforms.uPulse.value = reduced ? 0 : nichePulseRef.current[idx];
      nichePlinthMats[idx].uniforms.uTime.value = t;
    });

    const opsKeys: OpsModuleId[] = ["requests", "register"];
    opsMatRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const isSelected = world.current?.selectedOpsModule === opsKeys[idx];
      const targetS = isSelected ? 1.055 : 1.0;
      grp.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1);

      const targetPulse = isSelected ? 0.45 : 0.0;
      opsPulseRef.current[idx] += (targetPulse - opsPulseRef.current[idx]) * Math.min(1, delta * 3.5);
      opsPlinthMats[idx].uniforms.uPulse.value = reduced ? 0 : opsPulseRef.current[idx];
      opsPlinthMats[idx].uniforms.uTime.value = t;
    });

    flutedCarraraMat.uniforms.uTime.value = t;

    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -t * 0.08 - p * 3.0;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 0.35 - p * 12.0;
    }
  });

  return (
    <group>
      {/* 1. Bounded Gallery Marble & Travertine Floor (34m x 388m) */}
      <mesh
        material={floorMat}
        position={[0, FLOOR_Y, -272]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[34, 388]} />
      </mesh>

      {/* 2. Solid Lateral Gallery Walls (Left x = -16.2, Right x = +16.2) */}
      {[-16.2, 16.2].map((x) => (
        <mesh
          key={`wall_${x}`}
          material={wallMat}
          position={[x, 3.2, -268]}
          rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[380, 20.5]} />
        </mesh>
      ))}

      {/* 3. Entry Tympanum Back Wall behind Teleport (z = -82) */}
      <mesh material={wallMat} position={[0, 6.5, -82]}>
        <planeGeometry args={[34, 28]} />
      </mesh>

      {/* 4. Full Coffered Barrel-Vault Ceiling with Clerestory Skylights (Gallery Wing 1 & 2) */}
      <mesh
        material={vaultMat}
        position={[0, 13.4, -176]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[16.3, 16.3, 188, 32, 1, true, Math.PI / 2, Math.PI]} />
      </mesh>
      <mesh
        material={vaultMat}
        position={[0, 13.4, -380]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[16.3, 16.3, 120, 32, 1, true, Math.PI / 2, Math.PI]} />
      </mesh>

      {/* 5. Articulated Classical Columns with Turned Circular Bases, Echinus Capitals & Architrave */}
      {pilasterZ.map((z) =>
        [-15.4, 15.4].map((x) => (
          <group key={`pil_${z}_${x}`} position={[x, FLOOR_Y, z]}>
            {/* Stepped circular Attic base */}
            <mesh material={travertineMat} position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.92, 1.02, 0.56, 20]} />
            </mesh>
            <mesh material={bronzeMat} position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.82, 0.07, 10, 24]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 0.84, 0]}>
              <cylinderGeometry args={[0.76, 0.86, 0.36, 20]} />
            </mesh>

            {/* Tapered shaft */}
            <mesh material={carraraMat} position={[0, 10.2, 0]}>
              <cylinderGeometry args={[0.62, 0.74, 18.4, 20]} />
            </mesh>

            {/* Astragal & curved Echinus capital */}
            <mesh material={bronzeMat} position={[0, 19.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.66, 0.06, 10, 24]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 19.85, 0]}>
              <cylinderGeometry args={[0.96, 0.64, 0.72, 20]} />
            </mesh>
          </group>
        ))
      )}

      {[-15.4, 15.4].map((x) => (
        <group key={`ent_${x}`} position={[x, 13.4, -266]}>
          <mesh material={carraraMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.78, 0.78, 368, 12]} />
          </mesh>
          <mesh material={bronzeMat} position={[x < 0 ? 0.62 : -0.62, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 368, 8]} />
          </mesh>
        </group>
      ))}

      {/* 6. Act III — 6 Semicircular Shell-Dome Alcoves with Turned Fluted Baluster Plinths */}
      {NICHES.map((n, idx) => (
        <group
          key={n.key}
          ref={(el) => {
            nicheMatRefs.current[idx] = el;
          }}
          position={n.pos}
          rotation={[0, n.ry, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) {
              world.current.selectedCategory = n.key;
              world.current.userClickedGaze = true;
            }
            onSelectCategory?.(n.key);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (world.current) world.current.hoveredAnchor = n.key;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            if (world.current) world.current.hoveredAnchor = null;
            document.body.style.cursor = "";
          }}
        >
          {/* Semicircular Recessed Cylindrical Wall Shell & Scalloped Conch Dome */}
          <mesh material={travertineMat} position={[0, 4.4, -0.45]}>
            <cylinderGeometry args={[2.45, 2.45, 8.8, 24, 1, true, Math.PI * 0.5, Math.PI]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 8.8, -0.45]}>
            <sphereGeometry args={[2.45, 24, 12, Math.PI, Math.PI, 0, Math.PI / 2]} />
          </mesh>

          {/* Slender Flanking Ionic Colonnettes & Circular Archivolts */}
          {[-2.35, 2.35].map((cx) => (
            <mesh key={cx} material={carraraMat} position={[cx, 4.4, -0.35]}>
              <cylinderGeometry args={[0.25, 0.30, 8.8, 16]} />
            </mesh>
          ))}
          <mesh material={bronzeMat} position={[0, 8.75, -0.15]}>
            <torusGeometry args={[2.15, 0.08, 10, 32, Math.PI]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 8.75, -0.45]}>
            <torusGeometry args={[2.42, 0.24, 12, 32, Math.PI]} />
          </mesh>

          {/* Turned Fluted Classical Baluster Plinth & Bronze Rim Collar */}
          <mesh
            geometry={plinthGeo}
            material={nichePlinthMats[idx]}
            position={[0, 0, 0.2]}
            scale={[2.5, 3.18, 2.5]}
          />
          <mesh material={bronzeMat} position={[0, 3.14, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.08, 0.055, 10, 28]} />
          </mesh>

          {/* Chiseled Roman Oval Cartouche Plaque */}
          <mesh geometry={cartoucheGeo} position={[0, 1.85, 1.18]} scale={[1.7, 0.64, 1]}>
            <meshBasicMaterial map={plaqueTextures[idx]} />
          </mesh>

          {/* Real Scanned CC0 3D Museum Sculpture */}
          <NicheSculpture kind={n.key} />
        </group>
      ))}

      {/* 7. Act IV — Sunlit Pantheon Rotunda Dome, Floor Clock, Astrolabe Halo & Monuments (z = -296) */}
      <group position={[0, FLOOR_Y, -296]}>
        <mesh material={vaultMat} position={[0, 19.6, 0]}>
          <sphereGeometry args={[21.5, 36, 16, 0, Math.PI * 2, 0.34, Math.PI / 2 - 0.34]} />
        </mesh>
        <mesh material={bronzeMat} position={[0, 29.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7.2, 0.24, 12, 48]} />
        </mesh>

        {/* Stepped Circular Marble Dais & Inlaid Roman Floor Clock (XII · III · VI · IX) */}
        <mesh material={travertineMat} position={[0, 0.22, 0]}>
          <cylinderGeometry args={[8.6, 9.1, 0.44, 48]} />
        </mesh>
        <mesh material={carraraMat} position={[0, 0.54, 0]}>
          <cylinderGeometry args={[6.8, 7.2, 0.22, 48]} />
        </mesh>
        <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.5, 48]} />
          <meshBasicMaterial map={clockTex} />
        </mesh>

        {/* Tapered Bronze Spear Clock Hands Flat on the Floor Dais */}
        <group position={[0, 0.70, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh ref={hourHandRef} material={bronzeMat} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.14, 4.2, 10]} />
          </mesh>
          <mesh ref={minuteHandRef} material={bronzeMat} position={[0, 0, 0.04]}>
            <cylinderGeometry args={[0.02, 0.09, 5.6, 10]} />
          </mesh>
        </group>

        {/* Centerpiece Real 3D BarberShopChair_01 Beneath the Pantheon Oculus */}
        <MuseumModel name="BarberShopChair_01" finish="marble" position={[0, 0.72, 0]} height={4.2} />

        {/* Overhead Golden-Bronze Morphing Astrolabe Ribbon Halo */}
        <PantheonAstrolabeHalo scroll={scroll} world={world} reduced={reduced} />

        {/* Clean Hero Monuments on Turned Baluster Plinths: Pocket Watch & Cash Register */}
        <group
          ref={(el) => {
            opsMatRefs.current[0] = el;
          }}
          position={[-7.8, 0, 1.4]}
          rotation={[0, 0.36, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) {
              world.current.selectedOpsModule = "requests";
              world.current.userClickedGaze = true;
            }
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <mesh geometry={plinthGeo} material={opsPlinthMats[0]} scale={[2.1, 2.72, 2.1]} />
          <mesh material={bronzeMat} position={[0, 2.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.92, 0.05, 10, 28]} />
          </mesh>
          <mesh geometry={cartoucheGeo} position={[0, 1.65, 0.88]} scale={[1.45, 0.54, 1]}>
            <meshBasicMaterial map={watchPlaqueTex} />
          </mesh>
          <MuseumModel name="vintage_pocket_watch" finish="bronze" position={[0, 2.76, 0]} height={1.45} />
        </group>

        <group
          ref={(el) => {
            opsMatRefs.current[1] = el;
          }}
          position={[7.8, 0, 1.4]}
          rotation={[0, -0.36, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) {
              world.current.selectedOpsModule = "register";
              world.current.userClickedGaze = true;
            }
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <mesh geometry={plinthGeo} material={opsPlinthMats[1]} scale={[2.1, 2.72, 2.1]} />
          <mesh material={bronzeMat} position={[0, 2.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.92, 0.05, 10, 28]} />
          </mesh>
          <mesh geometry={cartoucheGeo} position={[0, 1.65, 0.88]} scale={[1.45, 0.54, 1]}>
            <meshBasicMaterial map={registerPlaqueTex} />
          </mesh>
          <MuseumModel name="CashRegister_01" finish="bronze" position={[0, 2.72, 0]} height={1.75} />
        </group>
      </group>

      {/* 8. Act V — Semicircular Marble Apse, Coffered Half-Dome & Concierge Rostrum (z = -438) */}
      <group position={[0, FLOOR_Y, -438]}>
        <mesh material={wallMat} position={[0, 10.2, 0]}>
          <cylinderGeometry args={[16.2, 16.2, 20.5, 32, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        <mesh material={vaultMat} position={[0, 20.4, 0]}>
          <sphereGeometry args={[16.2, 32, 14, Math.PI, Math.PI, 0, Math.PI / 2]} />
        </mesh>

        {/* Engraved "SMARTCHAIR ATELIER" Cartouche Frieze on the Apse Arch */}
        <mesh geometry={cartoucheGeo} position={[0, 16.4, -4.5]} scale={[11.2, 2.6, 1]}>
          <meshBasicMaterial map={friezeTex} />
        </mesh>

        {/* 3-Step Semicircular Carrara Marble & Travertine Apse Podium */}
        <mesh material={travertineMat} position={[0, 0.18, 0]}>
          <cylinderGeometry args={[10.5, 11.0, 0.36, 40]} />
        </mesh>
        <mesh material={carraraMat} position={[0, 0.52, 0]}>
          <cylinderGeometry args={[8.2, 8.6, 0.32, 40]} />
        </mesh>
        <mesh material={travertineMat} position={[0, 0.84, 0]}>
          <cylinderGeometry args={[6.0, 6.3, 0.32, 40]} />
        </mesh>

        {/* Interactive Real ClassicConsole_01 Concierge Desk on Marble Apse Podium */}
        <group
          onClick={(e) => {
            e.stopPropagation();
            onOpenConnect?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <MuseumModel name="ClassicConsole_01" finish="marble" position={[0, 1.0, 0.8]} height={4.0} />
        </group>

        {/* Twin Curly-Haired Classical Male Busts on Turned Fluted Plinths */}
        {[
          { x: -6.8, ry: 0.34 },
          { x: 6.8, ry: -0.34 },
        ].map((g) => (
          <group key={g.x} position={[g.x, 0.68, -2.0]} rotation={[0, g.ry, 0]}>
            <mesh geometry={plinthGeo} material={flutedCarraraMat} scale={[2.0, 2.82, 2.0]} />
            <mesh material={bronzeMat} position={[0, 2.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.88, 0.05, 10, 28]} />
            </mesh>
            <ClassicalMaleBust position={[0, 2.82, 0]} height={2.9} />
          </group>
        ))}
      </group>
    </group>
  );
}
