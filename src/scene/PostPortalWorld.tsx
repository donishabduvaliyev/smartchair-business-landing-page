import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY, C, FLOOR_Y } from "./constants";
import { FOG_FN, VERT_WORLD } from "./glsl";
import { ClassicalMaleBust } from "./ClassicalBust";
import { MuseumModel } from "./MuseumModel";
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
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.textAlign = "center";
    ctx.font = '600 42px "JetBrains Mono", monospace';
    ctx.fillStyle = "#7a5b34";
    ctx.fillText(title, 512, 155);

    ctx.font = 'italic 500 68px "Cormorant Garamond", Georgia, serif';
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

    // Outer bronze Vitruvian rings
    ctx.strokeStyle = "#8c6d46";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 940, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 740, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Hour Ticks & Roman Numerals
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
 * Dimension 2 — Enclosed Vatican "Braccio Nuovo" Renaissance Gallery,
 * Pantheon Oculus Rotunda, & Semicircular Marble Apse (Zero Flatworld).
 */
export function PostPortalWorld({
  scroll,
  world,
  onSelectCategory,
  onOpenConnect,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  onSelectCategory?: (key: string) => void;
  onOpenConnect?: () => void;
}) {
  const { gl } = useThree();
  const maxAniso = gl.capabilities.getMaxAnisotropy();

  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const nicheMatRefs = useRef<(THREE.Group | null)[]>([]);
  const opsMatRefs = useRef<(THREE.Group | null)[]>([]);

  const {
    floorMat,
    vaultMat,
    wallMat,
    carraraMat,
    travertineMat,
    bronzeMat,
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
          // Honed Carrara & Roman Travertine inlaid museum floor
          vec2 tile = floor(vec2(p.x * 0.30, p.y * 0.22));
          float checker = mod(tile.x + tile.y, 2.0);
          float gx = smoothstep(0.03, 0.0, min(fract(p.x * 0.30), 1.0 - fract(p.x * 0.30)));
          float gz = smoothstep(0.03, 0.0, min(fract(p.y * 0.22), 1.0 - fract(p.y * 0.22)));
          float vein = sin(p.x * 0.8 + sin(p.y * 0.32) * 2.0) * 0.024;

          vec3 travA = vec3(0.92, 0.88, 0.82) + vein;
          vec3 travB = vec3(0.86, 0.81, 0.74) - vein;
          vec3 col = mix(travA, travB, checker);
          col *= 1.0 - (gx + gz) * 0.10;

          // Center marble aisle runner & bronze inlay trim
          float runner = smoothstep(5.6, 5.2, abs(p.x));
          vec3 runnerCol = vec3(0.95, 0.92, 0.87) + vein * 0.5;
          col = mix(col, runnerCol, runner * 0.45);
          float trim = smoothstep(0.08, 0.0, abs(abs(p.x) - 5.4))
                     + smoothstep(0.07, 0.0, abs(abs(p.x) - 11.4));
          col = mix(col, vec3(0.55, 0.43, 0.27), clamp(trim * 0.65, 0.0, 0.75));

          // Sunlit skylight pools along the gallery axis
          float skyPool = 0.5 + 0.5 * cos(p.y * 0.16);
          col *= 0.92 + 0.12 * skyPool;

          gl_FragColor = vec4(applyFog(col, vZ), 1.0);
        }
      `,
    });

    // Coffered Renaissance Barrel-Vault Ceiling + Skylights Shader
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
          // Procedural Renaissance coffered panels & skylights
          float cu = fract(vWorld.z * 0.085);
          float cv = fract(vUv.x * 7.0);
          float border = min(min(cu, 1.0 - cu), min(cv, 1.0 - cv));
          float recess = smoothstep(0.14, 0.22, border);
          float bronzeRim = smoothstep(0.16, 0.12, abs(border - 0.14));

          // Clerestory sunlit skylight panels along vault crown
          float crown = smoothstep(3.8, 0.8, abs(vWorld.x));
          float skylight = crown * smoothstep(0.24, 0.30, border);

          vec3 stone = mix(vec3(0.91, 0.87, 0.80), vec3(0.80, 0.74, 0.66), recess * 0.65);
          stone = mix(stone, vec3(0.62, 0.49, 0.32), bronzeRim * 0.42);
          stone = mix(stone, vec3(0.99, 0.97, 0.93), skylight * 0.92);

          gl_FragColor = vec4(applyFog(stone, vZ), 1.0);
        }
      `,
    });

    // Solid Travertine Gallery Wall with Dado Wainscoting & Pilaster Bays
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
          // Bronze dado rail & cornice accent
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
    };
  }, [plaqueTextures, clockTex, friezeTex, watchPlaqueTex, registerPlaqueTex]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current?.smooth ?? 0;

    // Gentle highlight scale on selected Niche pedestal group
    nicheMatRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const isSelected = world.current?.selectedCategory === NICHES[idx].key;
      const targetS = isSelected ? 1.05 : 1.0;
      grp.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1);
    });

    const opsKeys: OpsModuleId[] = ["requests", "register"];
    opsMatRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const isSelected = world.current?.selectedOpsModule === opsKeys[idx];
      const targetS = isSelected ? 1.06 : 1.0;
      grp.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1);
    });

    // Sweep Roman Floor Clock bronze hands smoothly
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

      {/* 5. Articulated Ionic Pilasters & Continuous Entablature Beams */}
      {pilasterZ.map((z) =>
        [-15.4, 15.4].map((x) => (
          <group key={`pil_${z}_${x}`} position={[x, FLOOR_Y, z]}>
            <mesh material={travertineMat} position={[0, 0.5, 0]}>
              <boxGeometry args={[1.6, 1.0, 1.6]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 10.2, 0]}>
              <cylinderGeometry args={[0.62, 0.74, 18.4, 16]} />
            </mesh>
            <mesh material={bronzeMat} position={[0, 19.5, 0]}>
              <cylinderGeometry args={[0.82, 0.68, 0.24, 16]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 20.0, 0]}>
              <boxGeometry args={[1.7, 0.8, 1.7]} />
            </mesh>
          </group>
        ))
      )}

      {[-15.4, 15.4].map((x) => (
        <mesh key={`ent_${x}`} material={carraraMat} position={[x, 13.4, -266]}>
          <boxGeometry args={[1.5, 1.4, 368]} />
        </mesh>
      ))}

      {/* 6. Act III — 6 Recessed Arched Wall Niches with Real CC0 Scans & Plaques */}
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
          {/* Arched Niche Frame & Recessed Alcove */}
          <mesh material={travertineMat} position={[-2.4, 5.2, -0.8]}>
            <boxGeometry args={[0.7, 10.4, 1.4]} />
          </mesh>
          <mesh material={travertineMat} position={[2.4, 5.2, -0.8]}>
            <boxGeometry args={[0.7, 10.4, 1.4]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 8.6, -0.2]}>
            <torusGeometry args={[2.1, 0.08, 10, 32, Math.PI]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 8.6, -0.6]}>
            <torusGeometry args={[2.3, 0.28, 12, 32, Math.PI]} />
          </mesh>

          {/* Stepped Marble Display Pedestal */}
          <mesh material={travertineMat} position={[0, 0.35, 0.2]}>
            <boxGeometry args={[2.7, 0.7, 2.2]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 1.9, 0.2]}>
            <boxGeometry args={[2.1, 2.4, 1.8]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 3.16, 0.2]}>
            <boxGeometry args={[2.25, 0.12, 1.95]} />
          </mesh>

          {/* Chiseled Roman Pedestal Plaque */}
          <mesh position={[0, 1.95, 1.12]}>
            <planeGeometry args={[1.75, 0.66]} />
            <meshBasicMaterial map={plaqueTextures[idx]} />
          </mesh>

          {/* Real Scanned CC0 3D Museum Sculpture */}
          <NicheSculpture kind={n.key} />
        </group>
      ))}

      {/* 7. Act IV — Sunlit Pantheon Rotunda Dome, Floor Clock & Real Salon Monuments (z = -296) */}
      <group position={[0, FLOOR_Y, -296]}>
        {/* Coffered Pantheon Dome & Open Daylight Oculus (zero overlapping cone triangle) */}
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

        {/* Sweeping Bronze Clock Hands Flat on the Floor Dais */}
        <group position={[0, 0.70, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh ref={hourHandRef} material={bronzeMat} position={[0, 0, 0]}>
            <boxGeometry args={[0.18, 4.2, 0.04]} />
          </mesh>
          <mesh ref={minuteHandRef} material={bronzeMat} position={[0, 0, 0.03]}>
            <boxGeometry args={[0.11, 5.6, 0.04]} />
          </mesh>
        </group>

        {/* Centerpiece Real 3D BarberShopChair_01 Beneath the Pantheon Oculus */}
        <MuseumModel name="BarberShopChair_01" finish="marble" position={[0, 0.72, 0]} height={4.2} />

        {/* Clean Hero Monuments at Wide Distance: Upright Pocket Watch & Salon Cash Register */}
        <group
          ref={(el) => { opsMatRefs.current[0] = el; }}
          position={[-7.8, 0, 1.4]}
          rotation={[0, 0.36, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) {
              world.current.selectedOpsModule = "requests";
              world.current.userClickedGaze = true;
            }
          }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = ""; }}
        >
          <mesh material={travertineMat} position={[0, 0.3, 0]}>
            <boxGeometry args={[2.2, 0.6, 2.0]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 1.65, 0]}>
            <boxGeometry args={[1.7, 2.1, 1.5]} />
          </mesh>
          <mesh position={[0, 1.65, 0.77]}>
            <planeGeometry args={[1.45, 0.54]} />
            <meshBasicMaterial map={watchPlaqueTex} />
          </mesh>
          <MuseumModel name="vintage_pocket_watch" finish="bronze" position={[0, 2.76, 0]} height={1.45} />
        </group>

        <group
          ref={(el) => { opsMatRefs.current[1] = el; }}
          position={[7.8, 0, 1.4]}
          rotation={[0, -0.36, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) {
              world.current.selectedOpsModule = "register";
              world.current.userClickedGaze = true;
            }
          }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = ""; }}
        >
          <mesh material={travertineMat} position={[0, 0.3, 0]}>
            <boxGeometry args={[2.2, 0.6, 2.0]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 1.65, 0]}>
            <boxGeometry args={[1.7, 2.1, 1.5]} />
          </mesh>
          <mesh position={[0, 1.65, 0.77]}>
            <planeGeometry args={[1.45, 0.54]} />
            <meshBasicMaterial map={registerPlaqueTex} />
          </mesh>
          <MuseumModel name="CashRegister_01" finish="bronze" position={[0, 2.72, 0]} height={1.75} />
        </group>
      </group>

      {/* 8. Act V — Semicircular Marble Apse, Coffered Half-Dome & Integrated Concierge Rostrum (z = -438) */}
      <group position={[0, FLOOR_Y, -438]}>
        {/* Curved Semicircular Marble Apse Wall & Coffered Half-Dome Sealing the Hall */}
        <mesh material={wallMat} position={[0, 10.2, 0]}>
          <cylinderGeometry args={[16.2, 16.2, 20.5, 32, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        <mesh material={vaultMat} position={[0, 20.4, 0]}>
          <sphereGeometry args={[16.2, 32, 14, Math.PI, Math.PI, 0, Math.PI / 2]} />
        </mesh>

        {/* Engraved "SMARTCHAIR ATELIER" Roman Frieze on the Apse Arch */}
        <mesh position={[0, 16.4, -4.5]}>
          <planeGeometry args={[11.2, 2.6]} />
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

        {/* Twin Curly-Haired Classical Male Busts in Flanking Marble Pedestal Niches */}
        {[
          { x: -6.8, ry: 0.34 },
          { x: 6.8, ry: -0.34 },
        ].map((g) => (
          <group key={g.x} position={[g.x, 0.68, -2.0]} rotation={[0, g.ry, 0]}>
            <mesh material={carraraMat} position={[0, 1.35, 0]}>
              <boxGeometry args={[1.85, 2.7, 1.85]} />
            </mesh>
            <mesh material={bronzeMat} position={[0, 2.76, 0]}>
              <boxGeometry args={[2.0, 0.12, 2.0]} />
            </mesh>
            <ClassicalMaleBust position={[0, 2.82, 0]} height={2.9} />
          </group>
        ))}
      </group>
    </group>
  );
}
