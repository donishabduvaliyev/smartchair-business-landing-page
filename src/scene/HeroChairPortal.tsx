import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C, FLOOR_Y, FOG_COLOR, FOG_DENSITY } from "./constants";
import { shade } from "./shade";
import type { ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const PARTICLE_COUNT_DESKTOP = 3600;
const PARTICLE_COUNT_MOBILE = 650;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
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
  const spinAngle = useRef(0.35);

  const count = compact ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const { geos, mats, particleGeo, particleMat } = useMemo(() => {
    const g = {
      baseTap: shade(new THREE.CylinderGeometry(1, 0.42, 1, 18)),
      cyl: shade(new THREE.CylinderGeometry(1, 1, 1, 14)),
      box: shade(new THREE.BoxGeometry(1, 1, 1)),
    };

    const mChrome = new THREE.MeshBasicMaterial({
      color: C.CHROME,
      vertexColors: true,
      fog: true,
      transparent: true,
      opacity: 1,
    });
    const mHide = new THREE.MeshBasicMaterial({
      color: C.HIDE,
      vertexColors: true,
      fog: true,
      transparent: true,
      opacity: 1,
    });
    const mDark = new THREE.MeshBasicMaterial({
      color: C.DARK,
      vertexColors: true,
      fog: true,
      transparent: true,
      opacity: 1,
    });

    // Sample surface-aligned particles around the barber chair silhouette
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution across chair volume
      const h1 = ((i * 137.508 + 19) % 1000) / 1000;
      const h2 = ((i * 293.31 + 71) % 1000) / 1000;
      const h3 = ((i * 419.77 + 113) % 1000) / 1000;

      // Distribute across base, seat, backrest, and headrest
      let px = 0;
      let py = 0;
      let pz = 0;
      if (i % 4 === 0) {
        // Base & column
        const ang = h1 * Math.PI * 2;
        const rad = 0.4 + h2 * 1.6;
        px = Math.cos(ang) * rad;
        py = 0.2 + h3 * 2.2;
        pz = Math.sin(ang) * rad;
      } else if (i % 4 === 1) {
        // Seat & armrests
        px = (h1 - 0.5) * 3.4;
        py = 2.4 + h2 * 1.5;
        pz = (h3 - 0.5) * 3.2;
      } else {
        // Backrest & headrest
        px = (h1 - 0.5) * 3.0;
        py = 3.5 + h2 * 3.6;
        pz = -1.2 + (h3 - 0.5) * 0.9;
      }

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      seed[i * 3] = h1;
      seed[i * 3 + 1] = h2;
      seed[i * 3 + 2] = h3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uFogCol: { value: FOG_COLOR },
        uFogDen: { value: FOG_DENSITY },
        uColA: { value: new THREE.Color(0xd4af5a) }, // Champagne Brass
        uColB: { value: new THREE.Color(0xfff1d0) }, // Warm Ivory Spark
      },
      vertexShader: /* glsl */ `
        attribute vec3 aSeed;
        uniform float uMorph;
        uniform float uTime;
        varying float vAlpha;
        varying float vMix;
        void main() {
          vec3 p = position;
          float delay = aSeed.x * 0.35;
          float m = clamp((uMorph - delay) / 0.65, 0.0, 1.0);
          float mEase = m * m * (3.0 - 2.0 * m);

          // Swirl vortex & forward portal stream along -Z into Act III
          float angle = mEase * (3.8 + aSeed.y * 5.0) + uTime * 0.65;
          float radius = length(p.xz) + mEase * (2.5 + aSeed.z * 7.5);
          vec3 swirl = vec3(
            cos(angle) * radius,
            p.y + mEase * (2.2 + sin(uTime * 1.4 + aSeed.x * 6.28) * 1.2),
            sin(angle) * radius - mEase * (16.0 + aSeed.y * 54.0)
          );

          vec3 finalPos = mix(p, swirl, mEase);
          vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mv;

          float baseSize = mix(110.0, 260.0, aSeed.z);
          gl_PointSize = clamp(baseSize * (0.45 + mEase * 1.15) / max(-mv.z, 1.0), 2.5, 22.0);

          // Appear smoothly as chair begins levitating, linger through portal, fade after Act II
          float fadeIn = smoothstep(0.02, 0.18, uMorph);
          float fadeOut = 1.0 - smoothstep(0.86, 1.0, uMorph);
          vAlpha = fadeIn * fadeOut * (0.55 + 0.45 * aSeed.y);
          vMix = aSeed.z;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColA;
        uniform vec3 uColB;
        varying float vAlpha;
        varying float vMix;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = pow(1.0 - d * 2.0, 1.8);
          vec3 col = mix(uColA, uColB, vMix);
          gl_FragColor = vec4(col, glow * vAlpha * 0.9);
        }
      `,
    });

    return {
      geos: g,
      mats: { chrome: mChrome, hide: mHide, dark: mDark },
      particleGeo: pGeo,
      particleMat: pMat,
    };
  }, [count]);

  useFrame((state, delta) => {
    const p = scroll.current?.smooth ?? 0;
    const t = state.clock.elapsedTime;

    // Act II transformation window synchronized with camera passing z=-72 (p ~ 0.18)
    const lift = reduced ? 0 : smoothstep(0.07, 0.165, p);
    const explode = reduced ? 0 : smoothstep(0.09, 0.19, p);
    const morph = reduced ? 0 : smoothstep(0.12, 0.28, p);
    const chairOpacity = 1 - smoothstep(0.16, 0.21, p);

    if (world.current) {
      world.current.chairMorph = morph;
    }

    if (groupRef.current) {
      groupRef.current.position.y = FLOOR_Y + lift * 2.6 + (lift > 0.02 ? Math.sin(t * 1.6) * 0.22 * lift : 0);
      if (lift > 0.01 && !reduced) {
        spinAngle.current += delta * (0.35 + lift * 1.15);
      } else {
        spinAngle.current += (0.35 - spinAngle.current) * Math.min(delta * 4, 1);
      }
      groupRef.current.rotation.y = spinAngle.current;
      groupRef.current.visible = chairOpacity > 0.01 || morph < 0.99;
    }

    // Mechanical separation of chair components before particle dissolution
    if (baseRef.current) baseRef.current.position.y = -explode * 0.85;
    if (seatRef.current) seatRef.current.position.y = explode * 0.25;
    if (backRef.current) {
      backRef.current.position.z = -explode * 1.15;
      backRef.current.position.y = explode * 0.45;
    }
    if (headRef.current) headRef.current.position.y = 6.6 + explode * 1.45;
    if (armLRef.current) armLRef.current.position.x = -1.6 - explode * 0.85;
    if (armRRef.current) armRRef.current.position.x = 1.6 + explode * 0.85;
    if (footRef.current) footRef.current.position.z = explode * 0.95;

    mats.chrome.opacity = chairOpacity;
    mats.hide.opacity = chairOpacity;
    mats.dark.opacity = chairOpacity;

    particleMat.uniforms.uMorph.value = morph;
    particleMat.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef} position={[-1.6, FLOOR_Y, -72]}>
      {/* Base & Hydraulic Column */}
      <group ref={baseRef}>
        <mesh geometry={geos.baseTap} material={mats.chrome} position={[0, 0.3, 0]} scale={[2.0, 0.6, 2.0]} />
        <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 0.75, 0]} scale={[1.15, 0.4, 1.15]} />
        <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.7, 0]} scale={[0.48, 2.0, 0.48]} />
        <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.1, -1.0]} rotation={[1.15, 0, 0]} scale={[0.1, 1.5, 0.1]} />
      </group>

      {/* Seat & Armrests */}
      <group ref={seatRef}>
        <mesh geometry={geos.box} material={mats.hide} position={[0, 2.95, 0]} scale={[3.0, 0.85, 3.0]} />
        <mesh geometry={geos.box} material={mats.dark} position={[0, 2.45, 0]} scale={[3.2, 0.28, 3.2]} />
        <mesh ref={armLRef} geometry={geos.box} material={mats.dark} position={[-1.6, 3.75, 0]} scale={[0.55, 0.38, 2.9]} />
        <mesh ref={armRRef} geometry={geos.box} material={mats.dark} position={[1.6, 3.75, 0]} scale={[0.55, 0.38, 2.9]} />
      </group>

      {/* Backrest & Headrest */}
      <group ref={backRef}>
        <mesh geometry={geos.box} material={mats.hide} position={[0, 4.75, -1.25]} rotation={[-0.16, 0, 0]} scale={[3.0, 3.5, 0.8]} />
        <mesh geometry={geos.box} material={mats.dark} position={[0, 4.75, -1.42]} rotation={[-0.16, 0, 0]} scale={[3.2, 3.7, 0.22]} />
        <mesh ref={headRef} geometry={geos.box} material={mats.hide} position={[0, 6.6, -1.62]} rotation={[-0.16, 0, 0]} scale={[1.7, 1.0, 0.7]} />
      </group>

      {/* Footrest */}
      <group ref={footRef}>
        <mesh geometry={geos.box} material={mats.chrome} position={[0, 1.45, 1.9]} rotation={[0.42, 0, 0]} scale={[1.7, 0.16, 1.1]} />
        <mesh geometry={geos.cyl} material={mats.chrome} position={[0, 1.05, 1.35]} rotation={[0.5, 0, 0]} scale={[0.09, 1.0, 0.09]} />
      </group>

      {/* GPU Champagne Particle Metamorphosis Stream */}
      <points geometry={particleGeo} material={particleMat} frustumCulled={false} />
    </group>
  );
}
