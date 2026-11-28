import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C, FLOOR_Y, FOG_COLOR, FOG_DENSITY } from "./constants";
import { shade } from "./shade";
import type { ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const PARTICLE_COUNT_DESKTOP = 24000;
const PARTICLE_COUNT_MOBILE = 3500;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Deterministic fast hash in [0, 1) — zero grid striping */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function makeErosionMaterial(baseHex: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(baseHex) },
      uEdgeCol: { value: new THREE.Color(0xffe69c) },
      uDissolve: { value: 0 },
      uTime: { value: 0 },
      uFogCol: { value: FOG_COLOR },
      uFogDen: { value: FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      attribute vec3 color;
      varying vec3 vColor;
      varying vec3 vLocalPos;
      varying float vViewZ;
      void main() {
        vColor = color;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vLocalPos = worldPos.xyz;
        vec4 mv = viewMatrix * worldPos;
        vViewZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uEdgeCol;
      uniform float uDissolve;
      uniform float uTime;
      uniform vec3 uFogCol;
      uniform float uFogDen;
      varying vec3 vColor;
      varying vec3 vLocalPos;
      varying float vViewZ;

      float hash3(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise3(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
              mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
              mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }

      void main() {
        // Normalized chair height from FLOOR_Y (-7.0) up to ~+0.5
        float h = clamp((vLocalPos.y + 7.2) / 8.2, 0.0, 1.0);
        float n = noise3(vLocalPos * 1.45 + vec3(0.0, uTime * 0.25, 0.0));
        float field = h * 0.72 + n * 0.28;
        float threshold = uDissolve * 1.16 - 0.08;

        if (uDissolve > 0.005 && field < threshold) {
          discard;
        }

        float edgeDist = field - threshold;
        float edgeGlow = uDissolve > 0.005 ? (1.0 - smoothstep(0.0, 0.075, edgeDist)) : 0.0;

        vec3 lit = uColor * vColor;
        vec3 col = mix(lit, uEdgeCol * 2.2, edgeGlow);

        float f = 1.0 - exp(-uFogDen * uFogDen * vViewZ * vViewZ);
        col = mix(col, uFogCol, clamp(f, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

export function HeroChairPortal({
  scroll,
  world,
  reduced,
  compact = false,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  reduced: boolean;
  compact?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const seatRef = useRef<THREE.Group>(null);
  const backRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const armLRef = useRef<THREE.Mesh>(null);
  const armRRef = useRef<THREE.Mesh>(null);
  const footRef = useRef<THREE.Group>(null);
  const spinAngle = useRef(0.18);

  const count = compact ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const { geos, mats, particleGeo, particleMat, mirrorMat } = useMemo(() => {
    const g = {
      baseTap: shade(new THREE.CylinderGeometry(1, 0.42, 1, 24)),
      cyl: shade(new THREE.CylinderGeometry(1, 1, 1, 18)),
      box: shade(new THREE.BoxGeometry(1, 1, 1, 4, 4, 4)),
    };

    const mChrome = makeErosionMaterial(C.CHROME);
    const mHide = makeErosionMaterial(C.HIDE);
    const mDark = makeErosionMaterial(C.DARK);

    // 24,000 area-weighted surface points across chair parts (zero stripes)
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const meta = new Float32Array(count * 4); // [height01, randA, randB, randC]

    const cBrass = new THREE.Color(C.CHROME);
    const cLeather = new THREE.Color(0x9a6443); // warm sunlit cognac highlight
    const cIvory = new THREE.Color(0xffe69c);

    for (let i = 0; i < count; i++) {
      const r0 = rand(i * 3.17 + 1.0);
      const r1 = rand(i * 5.41 + 2.0);
      const r2 = rand(i * 7.73 + 3.0);
      const r3 = rand(i * 11.13 + 4.0);

      let px = 0;
      let py = 0;
      let pz = 0;
      let pickedCol = cLeather;

      if (r0 < 0.22) {
        // Cast brass base disc & hydraulic column
        const ang = r1 * Math.PI * 2;
        if (r2 < 0.65) {
          const rad = Math.sqrt(r3) * 2.0;
          px = Math.cos(ang) * rad;
          py = 0.05 + r2 * 0.7;
          pz = Math.sin(ang) * rad;
        } else {
          const rad = 0.48;
          px = Math.cos(ang) * rad;
          py = 0.6 + r3 * 2.1;
          pz = Math.sin(ang) * rad;
        }
        pickedCol = cBrass;
      } else if (r0 < 0.50) {
        // Cushioned seat & armrests
        if (r1 < 0.72) {
          px = (r2 - 0.5) * 3.1;
          py = 2.4 + r1 * 1.1;
          pz = (r3 - 0.5) * 3.1;
          pickedCol = cLeather;
        } else {
          const side = r2 < 0.5 ? -1.6 : 1.6;
          px = side + (r1 - 0.85) * 0.6;
          py = 3.55 + r2 * 0.4;
          pz = (r3 - 0.5) * 2.9;
          pickedCol = cIvory;
        }
      } else if (r0 < 0.88) {
        // Raked backrest & headrest
        if (r1 < 0.82) {
          px = (r2 - 0.5) * 3.1;
          py = 3.1 + r3 * 3.5;
          pz = -1.25 - (py - 3.1) * 0.16 + (r1 - 0.4) * 0.4;
          pickedCol = cLeather;
        } else {
          px = (r2 - 0.5) * 1.7;
          py = 6.1 + r3 * 1.1;
          pz = -1.62 + (r1 - 0.9) * 0.5;
          pickedCol = cIvory;
        }
      } else {
        // Brass footrest
        px = (r1 - 0.5) * 1.7;
        py = 1.25 + r2 * 0.4;
        pz = 1.6 + r3 * 0.8;
        pickedCol = cBrass;
      }

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      col[i * 3] = pickedCol.r;
      col[i * 3 + 1] = pickedCol.g;
      col[i * 3 + 2] = pickedCol.b;

      meta[i * 4] = Math.min(Math.max(py / 7.2, 0), 1);
      meta[i * 4 + 1] = r1;
      meta[i * 4 + 2] = r2;
      meta[i * 4 + 3] = r3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute("aMeta", new THREE.BufferAttribute(meta, 4));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uDissolve: { value: 0 },
        uPortal: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        attribute vec4 aMeta;
        uniform float uDissolve;
        uniform float uPortal;
        uniform float uTime;
        varying vec3 vCol;
        varying float vAlpha;

        void main() {
          float h = aMeta.x;
          float r1 = aMeta.y;
          float r2 = aMeta.z;
          float r3 = aMeta.w;

          // Particle ignites exactly when the erosion wave reaches its height
          float wave = clamp((uDissolve * 1.18 - h) * 3.8, 0.0, 1.0);
          float e = wave * wave * (3.0 - 2.0 * wave);

          // Curl-like upward turbulent drift off the chair surface
          float angle = r1 * 6.28318 + uTime * (0.5 + r2 * 0.9) + e * 3.2;
          float radial = e * (1.2 + r3 * 5.2);
          vec3 burstPos = position + vec3(
            cos(angle) * radial,
            e * (1.6 + r2 * 4.5) + sin(uTime * 1.8 + r1 * 6.28) * 0.4 * e,
            sin(angle) * radial - e * (3.0 + r1 * 6.0)
          );

          // Phase 2: Stream eroded chair particles forward into the Grand Barber Mirror at z = -22.6 local (-96.6 world)
          float pEase = uPortal * uPortal * (3.0 - 2.0 * uPortal);
          float ringAng = r1 * 6.28318 + uTime * (0.65 + r3 * 0.45);
          float ringRad = 1.6 + r2 * 2.4;
          vec3 portalPos = vec3(
            cos(ringAng) * ringRad,
            4.0 + sin(ringAng) * (ringRad * 1.15),
            -22.6 + (1.0 - pEase) * 6.5 + (r3 - 0.5) * 3.0
          );

          vec3 finalPos = mix(burstPos, portalPos, pEase);
          vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mv;

          float size = mix(42.0, 115.0, r3) * (0.5 + 0.5 * e);
          gl_PointSize = clamp(size / max(-mv.z, 1.0), 1.5, 11.0);

          float fadeIn = smoothstep(0.01, 0.14, wave);
          float fadeOut = 1.0 - smoothstep(0.84, 1.0, uPortal);
          vAlpha = fadeIn * fadeOut * (0.42 + 0.58 * r2);
          vCol = mix(aColor, vec3(1.0, 0.94, 0.80), 0.42 * e + 0.45 * pEase);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vCol;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = pow(1.0 - d * 2.0, 2.0);
          gl_FragColor = vec4(vCol, glow * vAlpha);
        }
      `,
    });

    const mirrorMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uAwaken: { value: 0 },
        uTime: { value: 0 },
        uFogCol: { value: FOG_COLOR },
        uFogDen: { value: FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vViewZ;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uAwaken;
        uniform float uTime;
        uniform vec3 uFogCol;
        uniform float uFogDen;
        varying vec2 vUv;
        varying float vViewZ;
        void main() {
          vec2 c = vUv - 0.5;
          float d = length(c * vec2(1.0, 1.35));
          float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
          float bezel = smoothstep(0.055, 0.0, edge);

          // Rest state: beveled barbershop mirror reflecting warm indoor highlights
          vec3 glassCol = vec3(0.11, 0.13, 0.16)
                        + vec3(0.32, 0.24, 0.14) * pow(max(1.0 - abs(vUv.y - 0.82) / 0.22, 0.0), 2.0)
                        + vec3(0.83, 0.69, 0.35) * bezel * 1.1;

          // Awakened state: concentric liquid-glass ripples & bright alabaster-gold daylight portal
          float ripple = sin(d * 26.0 - uTime * 4.2) * 0.5 + 0.5;
          float core = smoothstep(0.58 * (0.2 + uAwaken * 1.15), 0.02, d);
          vec3 daylightCol = mix(vec3(0.92, 0.82, 0.62), vec3(0.99, 0.96, 0.90), core);
          daylightCol += vec3(0.98, 0.88, 0.68) * ripple * 0.18 * uAwaken;

          vec3 col = mix(glassCol, daylightCol, smoothstep(0.04, 0.82, uAwaken * (1.2 - d * 0.65)));
          float f = 1.0 - exp(-uFogDen * uFogDen * vViewZ * vViewZ);
          col = mix(col, uFogCol, clamp(f, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.98);
        }
      `,
    });

    return {
      geos: g,
      mats: { chrome: mChrome, hide: mHide, dark: mDark },
      particleGeo: pGeo,
      particleMat: pMat,
      mirrorMat,
    };
  }, [count]);

  useFrame((state, delta) => {
    const p = scroll.current?.smooth ?? 0;
    const t = state.clock.elapsedTime;

    // 1. Levitation & Mechanical Separation during Act II Orbit (0.12 -> 0.24)
    const lift = reduced ? 0 : smoothstep(0.11, 0.20, p);
    const explode = reduced ? 0 : smoothstep(0.14, 0.24, p);
    // 2. Surface Erosion Wave across chair mesh (0.17 -> 0.33)
    const dissolve = reduced ? 0 : smoothstep(0.17, 0.33, p);
    // 3. Toroidal Portal Tunnel convergence & fly-through fade (0.28 -> 0.45)
    const portal = reduced ? 0 : smoothstep(0.28, 0.45, p);

    if (world.current) {
      world.current.chairMorph = dissolve;
    }

    if (groupRef.current) {
      groupRef.current.position.y =
        FLOOR_Y + lift * 2.8 + (lift > 0.02 ? Math.sin(t * 1.4) * 0.18 * lift : 0);
      if (lift > 0.01 && !reduced) {
        spinAngle.current += delta * (0.28 + lift * 0.55);
      } else {
        spinAngle.current += (0.18 - spinAngle.current) * Math.min(delta * 4, 1);
      }
      groupRef.current.rotation.y = spinAngle.current;
      groupRef.current.visible = p < 0.48;
    }

    if (baseRef.current) baseRef.current.position.y = -explode * 0.7;
    if (seatRef.current) seatRef.current.position.y = explode * 0.25;
    if (backRef.current) {
      backRef.current.position.z = -explode * 0.95;
      backRef.current.position.y = explode * 0.4;
    }
    if (headRef.current) headRef.current.position.y = 6.6 + explode * 1.3;
    if (armLRef.current) armLRef.current.position.x = -1.6 - explode * 0.75;
    if (armRRef.current) armRRef.current.position.x = 1.6 + explode * 0.75;
    if (footRef.current) footRef.current.position.z = explode * 0.85;

    [mats.chrome, mats.hide, mats.dark].forEach((m) => {
      m.uniforms.uDissolve.value = dissolve;
      m.uniforms.uTime.value = t;
    });

    particleMat.uniforms.uDissolve.value = dissolve;
    particleMat.uniforms.uPortal.value = portal;
    particleMat.uniforms.uTime.value = t;

    const awaken = reduced ? 0 : smoothstep(0.18, 0.36, p);
    mirrorMat.uniforms.uAwaken.value = awaken;
    mirrorMat.uniforms.uTime.value = t;
  });

  return (
    <group>
      <group ref={groupRef} position={[0, FLOOR_Y, -74]}>
        <group ref={baseRef}>
          <mesh geometry={geos.baseTap} material={mats.chrome} position={[0, 0.3, 0]} scale={[2.0, 0.6, 2.0]} />
          <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 0.75, 0]} scale={[1.15, 0.4, 1.15]} />
          <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.7, 0]} scale={[0.48, 2.0, 0.48]} />
          <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.1, -1.0]} rotation={[1.15, 0, 0]} scale={[0.1, 1.5, 0.1]} />
        </group>

        <group ref={seatRef}>
          <mesh geometry={geos.box} material={mats.hide} position={[0, 2.95, 0]} scale={[3.0, 0.85, 3.0]} />
          <mesh geometry={geos.box} material={mats.dark} position={[0, 2.45, 0]} scale={[3.2, 0.28, 3.2]} />
          <mesh ref={armLRef} geometry={geos.box} material={mats.dark} position={[-1.6, 3.75, 0]} scale={[0.55, 0.38, 2.9]} />
          <mesh ref={armRRef} geometry={geos.box} material={mats.dark} position={[1.6, 3.75, 0]} scale={[0.55, 0.38, 2.9]} />
        </group>

        <group ref={backRef}>
          <mesh geometry={geos.box} material={mats.hide} position={[0, 4.75, -1.25]} rotation={[-0.16, 0, 0]} scale={[3.0, 3.5, 0.8]} />
          <mesh geometry={geos.box} material={mats.dark} position={[0, 4.75, -1.42]} rotation={[-0.16, 0, 0]} scale={[3.2, 3.7, 0.22]} />
          <mesh ref={headRef} geometry={geos.box} material={mats.hide} position={[0, 6.6, -1.62]} rotation={[-0.16, 0, 0]} scale={[1.7, 1.0, 0.7]} />
        </group>

        <group ref={footRef}>
          <mesh geometry={geos.box} material={mats.chrome} position={[0, 1.45, 1.9]} rotation={[0.42, 0, 0]} scale={[1.7, 0.16, 1.1]} />
          <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.05, 1.35]} rotation={[0.5, 0, 0]} scale={[0.09, 1.0, 0.09]} />
        </group>

        {/* 24,000 Surface-Sampled Erosion & Looking-Glass Particles */}
        <points geometry={particleGeo} material={particleMat} frustumCulled={false} />
      </group>

      {/* Grand Barber Looking-Glass Mirror Barrier at z = -96.6 */}
      <mesh material={mirrorMat} position={[0, -0.4, -96.6]}>
        <planeGeometry args={[7.8, 10.4]} />
      </mesh>
    </group>
  );
}
