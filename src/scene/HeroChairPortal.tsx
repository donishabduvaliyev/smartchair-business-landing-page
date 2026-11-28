import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { FLOOR_Y, FOG_COLOR, FOG_DENSITY } from "./constants";
import { FOG_FN } from "./glsl";
import { loadRawSalonAsset, type SalonRawAsset } from "./MuseumModel";
import {
  makeArchedFrameGeo,
  makeArchedPortalGeo,
  makeAstrolabeTubeGridGeo,
  makeClassicalBalusterPlinthGeo,
} from "./sculptedGeometries";
import type { ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const PARTICLE_COUNT_DESKTOP = 8500;
const PARTICLE_COUNT_MOBILE = 1800;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Deterministic fast hash in [0, 1) — zero grid striping */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function makeMorphingHeroChairMaterial(diffTex: THREE.Texture | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uDiff: { value: diffTex },
      uHasDiff: { value: diffTex ? 1.0 : 0.0 },
      uMorph: { value: 0 },
      uStream: { value: 0 },
      uTime: { value: 0 },
      uFogCol: { value: FOG_COLOR },
      uFogDen: { value: FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      uniform float uMorph;
      uniform float uStream;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vLocal;
      varying vec3 vNorm;
      varying float vViewZ;

      void main() {
        vUv = uv;
        vLocal = position;

        // Stage 2: Genus-0 helical liquid-bronze spiral twist + organic surface ripple
        float ang = uMorph * (1.8 + position.y * 3.6);
        float c = cos(ang);
        float s = sin(ang);
        vec3 twistedPos = vec3(
          position.x * c - position.z * s,
          position.y,
          position.x * s + position.z * c
        );
        float rippleAmp = sin(uMorph * 3.14159) * 0.025 * (1.0 - uStream);
        twistedPos += normal * sin(position.y * 12.0 - uTime * 2.0) * rippleAmp;

        vec3 twistedNorm = normalize(vec3(
          normal.x * c - normal.z * s,
          normal.y,
          normal.x * s + normal.z * c
        ));

        // Stage 3: Tapered genus-0 spindle streaming forward cleanly into the open Portal Ring
        float taper = mix(1.0, 0.16 * sin(clamp(position.y, 0.0, 1.0) * 3.14159) + 0.03, uStream);
        float ySpindle = mix(twistedPos.y, 0.52 + (position.y - 0.5) * 0.55, uStream);
        float zSpindle = twistedPos.z * taper - uStream * (1.1 - position.y) * 1.4;
        vec3 pos = vec3(twistedPos.x * taper, ySpindle, zSpindle);

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vNorm = normalize(mat3(modelMatrix) * twistedNorm);
        vec4 mv = viewMatrix * worldPos;
        vViewZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uDiff;
      uniform float uHasDiff;
      uniform float uMorph;
      uniform float uStream;
      uniform vec3 uFogCol;
      uniform float uFogDen;
      varying vec2 vUv;
      varying vec3 vLocal;
      varying vec3 vNorm;
      varying float vViewZ;

      void main() {
        vec3 n = normalize(vNorm);
        float key = max(n.y, 0.0);
        float front = max(n.z, 0.0);
        float side = max(abs(n.x), 0.0);
        float ao = 0.92;
        if (uHasDiff > 0.5) {
          vec3 tex = texture2D(uDiff, vUv).rgb;
          ao = clamp(dot(tex, vec3(0.333)) * 1.25, 0.38, 1.05);
        }

        // Exposure-calibrated cognac leather & brass -> burnished molten bronze
        float isBase = 1.0 - smoothstep(0.28, 0.34, vLocal.y);
        vec3 leather = vec3(0.36, 0.20, 0.13);
        vec3 brass = vec3(0.66, 0.51, 0.24);
        vec3 chairCol = mix(leather, brass, isBase) * ao;
        vec3 moltenBronze = vec3(0.58, 0.43, 0.19);
        vec3 baseTone = mix(chairCol, moltenBronze, clamp(uMorph * 0.85, 0.0, 1.0));

        float shadeLight = 0.44 + key * 0.56 + front * 0.24 + side * 0.16;
        vec3 specDir = normalize(vec3(0.25, 0.75, 0.6));
        vec3 spec = vec3(0.92, 0.78, 0.46) * pow(max(dot(n, specDir), 0.0), 22.0) * (0.22 + 0.35 * uMorph);
        vec3 col = baseTone * shadeLight + spec;

        float f = 1.0 - exp(-uFogDen * uFogDen * vViewZ * vViewZ);
        col = mix(col, uFogCol, clamp(f, 0.0, 1.0));
        float alpha = 1.0 - smoothstep(0.75, 1.0, uStream);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

function makePortalRingMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uOpen: { value: 0 },
      uFade: { value: 1 },
      uTime: { value: 0 },
      uFogCol: { value: FOG_COLOR },
      uFogDen: { value: FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      uniform float uOpen;
      uniform float uTime;
      varying vec3 vNorm;
      varying vec3 vViewDir;
      varying float vViewZ;

      vec3 evalHoop(float th, float openAmt, float t) {
        float majorR = (0.35 + 2.75 * openAmt) * (1.0 + 0.055 * sin(6.0 * th - t * 1.8));
        float zWave = 0.22 * sin(3.0 * th + t * 1.2) * openAmt;
        return vec3(cos(th) * majorR, sin(th) * majorR * 1.08, zWave);
      }

      void main() {
        float u = position.x;
        float v = position.y;
        float th = u * 6.2831853;

        vec3 center = evalHoop(th, uOpen, uTime);
        vec3 nextP = evalHoop(th + 0.015, uOpen, uTime);
        vec3 tangent = normalize(nextP - center);
        vec3 refZ = vec3(0.0, 0.0, 1.0);
        vec3 binorm = normalize(cross(tangent, refZ));
        vec3 norm = normalize(cross(binorm, tangent));

        float phi = v * 6.2831853;
        float tubeR = 0.13 * smoothstep(0.02, 0.35, uOpen);
        vec3 offsetDir = cos(phi) * norm + sin(phi) * binorm;
        vec3 localPos = center + offsetDir * tubeR;

        vec4 wp = modelMatrix * vec4(localPos, 1.0);
        vNorm = normalize(mat3(modelMatrix) * offsetDir);
        vViewDir = normalize(cameraPosition - wp.xyz);
        vec4 mv = viewMatrix * wp;
        vViewZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform float uOpen;
      uniform float uFade;
      varying vec3 vNorm;
      varying vec3 vViewDir;
      varying float vViewZ;

      void main() {
        vec3 n = normalize(vNorm);
        vec3 v = normalize(vViewDir);
        vec3 sun = normalize(vec3(0.25, 0.72, 0.65));
        float ndl = max(dot(n, sun), 0.0);
        vec3 h = normalize(sun + v);
        float spec = pow(max(dot(n, h), 0.0), 28.0) * 0.45;
        float rim = pow(1.0 - max(dot(n, v), 0.0), 2.4) * 0.25;

        vec3 bronze = vec3(0.54, 0.40, 0.17) * (0.50 + 0.50 * ndl)
                    + vec3(0.95, 0.82, 0.50) * (spec + rim);
        float alpha = smoothstep(0.01, 0.18, uOpen) * uFade;
        gl_FragColor = vec4(applyFog(bronze, vViewZ), alpha);
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
  const ringRef = useRef<THREE.Mesh>(null);
  const spinAngle = useRef(0.18);
  const [rawChair, setRawChair] = useState<SalonRawAsset | null>(null);

  useEffect(() => {
    let active = true;
    loadRawSalonAsset("BarberShopChair_01")
      .then((a) => {
        if (active) setRawChair(a);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const count = compact ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const {
    fallbackGeo,
    chairMat,
    portalRingGeo,
    portalRingMat,
    particleGeo,
    particleMat,
    mirrorGeo,
    mirrorFrameGeo,
    mirrorFrameMat,
    mirrorMat,
  } = useMemo(() => {
    const fbGeo = makeClassicalBalusterPlinthGeo(28);
    const cMat = makeMorphingHeroChairMaterial(null);
    const prGeo = makeAstrolabeTubeGridGeo(140, 14);
    const prMat = makePortalRingMaterial();

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const meta = new Float32Array(count * 4);

    const cBrass = new THREE.Color(0xd4af5a);
    const cLeather = new THREE.Color(0x9a6443);
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

      if (r0 < 0.25) {
        const ang = r1 * Math.PI * 2;
        const rad = Math.sqrt(r3) * 1.8;
        px = Math.cos(ang) * rad;
        py = 0.05 + r2 * 1.8;
        pz = Math.sin(ang) * rad;
        pickedCol = cBrass;
      } else if (r0 < 0.65) {
        px = (r2 - 0.5) * 2.8;
        py = 2.0 + r1 * 2.2;
        pz = (r3 - 0.5) * 2.8;
        pickedCol = cLeather;
      } else {
        px = (r2 - 0.5) * 2.4;
        py = 4.0 + r3 * 2.5;
        pz = -0.8 + (r1 - 0.5) * 1.2;
        pickedCol = cIvory;
      }

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      col[i * 3] = pickedCol.r;
      col[i * 3 + 1] = pickedCol.g;
      col[i * 3 + 2] = pickedCol.b;

      meta[i * 4] = Math.min(Math.max(py / 6.6, 0), 1);
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
        uMorph: { value: 0 },
        uPortal: { value: 0 },
        uGroupZShift: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        attribute vec4 aMeta;
        uniform float uMorph;
        uniform float uPortal;
        uniform float uGroupZShift;
        uniform float uTime;
        varying vec3 vCol;
        varying float vAlpha;

        void main() {
          float h = aMeta.x;
          float r1 = aMeta.y;
          float r2 = aMeta.z;
          float r3 = aMeta.w;

          float wave = clamp((uMorph * 1.18 - h) * 3.6, 0.0, 1.0);
          float e = wave * wave * (3.0 - 2.0 * wave);

          float angle = r1 * 6.28318 + uTime * (0.4 + r2 * 0.7) + e * 3.4;
          float radial = e * (1.2 + r3 * 4.4);
          vec3 burstPos = position + vec3(
            cos(angle) * radial,
            e * (1.4 + r2 * 3.8) + sin(uTime * 1.5 + r1 * 6.28) * 0.35 * e,
            sin(angle) * radial - e * (2.6 + r1 * 5.2)
          );

          float pEase = uPortal * uPortal * (3.0 - 2.0 * uPortal);
          float ringAng = r1 * 6.28318 + uTime * (0.55 + r3 * 0.4);
          float ringRad = 2.7 + r2 * 0.9;
          vec3 portalPos = vec3(
            cos(ringAng) * ringRad,
            4.2 + sin(ringAng) * (ringRad * 1.08),
            -22.4 + uGroupZShift + (1.0 - pEase) * 4.5 + (r3 - 0.5) * 2.0
          );

          vec3 finalPos = mix(burstPos, portalPos, pEase);
          vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mv;

          float size = mix(46.0, 110.0, r3) * (0.5 + 0.5 * e);
          gl_PointSize = clamp(size / max(-mv.z, 1.0), 1.8, 11.0);

          float fadeIn = smoothstep(0.01, 0.14, wave);
          float fadeOut = 1.0 - smoothstep(0.85, 1.0, uPortal);
          vAlpha = fadeIn * fadeOut * (0.36 + 0.50 * r2);
          vCol = mix(aColor, vec3(1.0, 0.90, 0.68), 0.42 * e + 0.45 * pEase);
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

    const mGeo = makeArchedPortalGeo(8.2, 11.4, 36, 48);
    const mfGeo = makeArchedFrameGeo(8.2, 11.4, 0.24);
    const mfMat = new THREE.MeshBasicMaterial({ color: 0x9b7b43, fog: true });

    const mMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uAwaken: { value: 0 },
        uFlash: { value: 0 },
        uTime: { value: 0 },
        uFogCol: { value: FOG_COLOR },
        uFogDen: { value: FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        uniform float uAwaken;
        uniform float uTime;
        varying vec2 vUv;
        varying float vViewZ;
        void main() {
          vUv = uv;
          vec2 c = uv - 0.5;
          float d = length(c * vec2(1.0, 1.35));

          vec3 pos = position;
          float pull = uAwaken * 1.4 * exp(-d * 2.2);
          float ripple = sin(d * 22.0 - uTime * 3.4) * 0.18 * uAwaken * (1.0 - smoothstep(0.0, 0.55, d));
          pos.z -= pull - ripple;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vViewZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uAwaken;
        uniform float uFlash;
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

          vec3 glassCol = vec3(0.11, 0.13, 0.16)
                        + vec3(0.32, 0.24, 0.14) * pow(max(1.0 - abs(vUv.y - 0.80) / 0.22, 0.0), 2.0)
                        + vec3(0.75, 0.60, 0.28) * bezel;

          float wave = sin(d * 34.0 - uTime * 3.6) * 0.5 + 0.5;
          float crest = pow(wave, 2.0);
          float ringMask = smoothstep(0.56, 0.04, d);
          vec3 mercuryTrough = vec3(0.11, 0.13, 0.17);
          vec3 goldCrest = vec3(0.68, 0.53, 0.25);
          vec3 portalCore = vec3(0.82, 0.72, 0.50) * smoothstep(0.22, 0.0, d);
          vec3 awakenedGlass = mix(mercuryTrough, goldCrest, crest * 0.85) * ringMask
                             + portalCore
                             + vec3(0.65, 0.52, 0.25) * bezel;

          vec3 col = mix(glassCol, awakenedGlass, smoothstep(0.04, 0.85, uAwaken));
          col = mix(col, vec3(0.96, 0.93, 0.86), uFlash);

          float f = 1.0 - exp(-uFogDen * uFogDen * vViewZ * vViewZ);
          col = mix(col, uFogCol, clamp(f, 0.0, 1.0));
          gl_FragColor = vec4(col, 0.98);
        }
      `,
    });

    return {
      fallbackGeo: fbGeo,
      chairMat: cMat,
      portalRingGeo: prGeo,
      portalRingMat: prMat,
      particleGeo: pGeo,
      particleMat: pMat,
      mirrorGeo: mGeo,
      mirrorFrameGeo: mfGeo,
      mirrorFrameMat: mfMat,
      mirrorMat: mMat,
    };
  }, [count]);

  useEffect(() => {
    chairMat.uniforms.uDiff.value = rawChair?.diffTex ?? null;
    chairMat.uniforms.uHasDiff.value = rawChair?.diffTex ? 1.0 : 0.0;
  }, [rawChair, chairMat]);

  useEffect(() => {
    return () => {
      chairMat.dispose();
      portalRingGeo.dispose();
      portalRingMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      mirrorGeo.dispose();
      mirrorFrameGeo.dispose();
      mirrorFrameMat.dispose();
      mirrorMat.dispose();
      fallbackGeo.dispose();
    };
  }, [
    chairMat,
    portalRingGeo,
    portalRingMat,
    particleGeo,
    particleMat,
    mirrorGeo,
    mirrorFrameGeo,
    mirrorFrameMat,
    mirrorMat,
    fallbackGeo,
  ]);

  useFrame((state, delta) => {
    const p = scroll.current?.smooth ?? 0;
    const t = state.clock.elapsedTime;

    const lift = reduced ? 0 : smoothstep(0.11, 0.20, p);
    const morph = reduced ? 0 : smoothstep(0.13, 0.28, p);
    const stream = reduced ? 0 : smoothstep(0.24, 0.345, p);
    const portal = reduced ? 0 : smoothstep(0.28, 0.368, p);
    const zShift = stream * 19.2;

    if (world.current) {
      world.current.chairMorph = morph;
    }

    if (groupRef.current) {
      groupRef.current.position.set(
        0,
        FLOOR_Y + lift * 2.1 - stream * 1.2 + Math.sin(t * 1.4) * 0.05,
        -74 - zShift
      );
      if (lift > 0.01 && !reduced) {
        spinAngle.current += delta * (0.24 + morph * 0.40) * (1 - stream * 0.65);
      } else {
        spinAngle.current += (0.18 - spinAngle.current) * Math.min(delta * 4, 1);
      }
      groupRef.current.rotation.y = spinAngle.current * (1 - stream);
      groupRef.current.visible = p < 0.355;
    }

    if (ringRef.current) {
      ringRef.current.visible = p > 0.18 && p < 0.375;
    }

    chairMat.uniforms.uMorph.value = morph;
    chairMat.uniforms.uStream.value = stream;
    chairMat.uniforms.uTime.value = t;

    portalRingMat.uniforms.uOpen.value = reduced ? 0 : smoothstep(0.19, 0.31, p);
    portalRingMat.uniforms.uFade.value = 1.0 - smoothstep(0.355, 0.372, p);
    portalRingMat.uniforms.uTime.value = t;

    particleMat.uniforms.uMorph.value = morph;
    particleMat.uniforms.uPortal.value = portal;
    particleMat.uniforms.uGroupZShift.value = zShift;
    particleMat.uniforms.uTime.value = t;

    const awaken = reduced ? 0 : smoothstep(0.16, 0.34, p);
    const flash = reduced ? 0 : smoothstep(0.34, 0.366, p);
    mirrorMat.uniforms.uAwaken.value = awaken;
    mirrorMat.uniforms.uFlash.value = flash;
    mirrorMat.uniforms.uTime.value = t;
  });

  const activeChairGeo = rawChair?.geometry ?? fallbackGeo;

  return (
    <group>
      <group ref={groupRef} position={[0, FLOOR_Y, -74]}>
        <mesh
          geometry={activeChairGeo}
          material={chairMat}
          scale={[6.6, 6.6, 6.6]}
          frustumCulled={false}
        />

        {/* 8.5k / 1.8k Surface-Sampled Golden Portal Particles */}
        <points geometry={particleGeo} material={particleMat} frustumCulled={false} />
      </group>

      {/* Open-Centered Golden Toroidal Portal Ring before the Arched Mirror */}
      <mesh
        ref={ringRef}
        geometry={portalRingGeo}
        material={portalRingMat}
        position={[0, 0.1, -93.2]}
        frustumCulled={false}
      />

      {/* Rippling Arched Looking-Glass Mirror Barrier at z = -96.4 */}
      <group position={[0, -0.4, -96.4]}>
        <mesh geometry={mirrorGeo} material={mirrorMat} />
        <mesh geometry={mirrorFrameGeo} material={mirrorFrameMat} />
      </group>
    </group>
  );
}
