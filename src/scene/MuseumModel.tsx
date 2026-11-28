import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY } from "./constants";
import { FOG_FN } from "./glsl";

export type MuseumFinish = "marble" | "bronze";

const assetCache = new Map<string, THREE.Group>();
const promiseCache = new Map<string, Promise<THREE.Group>>();

const PRELOAD_QUEUE: Array<{ name: string; finish: MuseumFinish }> = [
  { name: "BarberShopChair_01", finish: "marble" },
  { name: "ornate_mirror_01", finish: "bronze" },
  { name: "vintage_pocket_watch", finish: "bronze" },
  { name: "CashRegister_01", finish: "bronze" },
  { name: "ClassicConsole_01", finish: "marble" },
  { name: "antique_ceramic_vase_01", finish: "marble" },
  { name: "brass_vase_01", finish: "bronze" },
  { name: "brass_goblets", finish: "bronze" },
  { name: "seadogs_compass", finish: "bronze" },
];

function makeMuseumMaterial(diffTex: THREE.Texture | null, finish: MuseumFinish): THREE.ShaderMaterial {
  const tint = finish === "bronze" ? new THREE.Color(0x8c6d46) : new THREE.Color(0xf4efe6);
  const specTint = finish === "bronze" ? new THREE.Color(0xdfbe84) : new THREE.Color(0xfffaf0);

  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uDiff: { value: diffTex },
      uHasDiff: { value: diffTex ? 1.0 : 0.0 },
      uTint: { value: tint },
      uSpec: { value: specTint },
      uIsBronze: { value: finish === "bronze" ? 1.0 : 0.0 },
      uFogCol: { value: ALABASTER_FOG },
      uFogDen: { value: ALABASTER_FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNorm;
      varying vec3 vViewDir;
      varying float vZ;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vNorm = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - wp.xyz);
        vec4 mv = viewMatrix * wp;
        vZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform sampler2D uDiff;
      uniform float uHasDiff;
      uniform vec3 uTint;
      uniform vec3 uSpec;
      uniform float uIsBronze;
      varying vec2 vUv;
      varying vec3 vNorm;
      varying vec3 vViewDir;
      varying float vZ;
      void main() {
        vec3 n = normalize(vNorm);
        vec3 v = normalize(vViewDir);
        float ao = 0.92;
        if (uHasDiff > 0.5) {
          vec3 tex = texture2D(uDiff, vUv).rgb;
          ao = clamp(dot(tex, vec3(0.333)) * 1.25, 0.45, 1.08);
        }

        vec3 sun = normalize(vec3(0.38, 0.84, 0.42));
        float ndl = max(dot(n, sun), 0.0);
        float hemi = 0.62 + 0.40 * ndl;
        vec3 h = normalize(sun + v);
        float spec = pow(max(dot(n, h), 0.0), mix(18.0, 32.0, uIsBronze)) * mix(0.08, 0.34, uIsBronze);
        float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.14;

        vec3 col = uTint * ao * hemi + uSpec * (spec + rim);
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }
    `,
  });
}

function loadMuseumModel(modelName: string, finish: MuseumFinish): Promise<THREE.Group> {
  const key = `${modelName}:${finish}`;
  const existing = assetCache.get(key);
  if (existing) return Promise.resolve(existing);
  const inflight = promiseCache.get(key);
  if (inflight) return inflight;

  const p = new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      `/models/${modelName}/${modelName}_1k.gltf`,
      (gltf) => {
        const root = gltf.scene;
        root.updateMatrixWorld(true);

        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            const origMat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
            const diffTex =
              origMat && "map" in origMat && origMat.map instanceof THREE.Texture
                ? origMat.map
                : null;
            obj.material = makeMuseumMaterial(diffTex, finish);
            if (!obj.geometry.attributes.normal) {
              obj.geometry.computeVertexNormals();
            }
          }
        });

        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Normalize by largest XYZ dimension so flat scans never explode across the floor
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 1 / maxDim : 1;
        const norm = new THREE.Group();
        root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        root.scale.setScalar(scale);
        norm.add(root);

        assetCache.set(key, norm);
        resolve(norm);
      },
      undefined,
      (err) => {
        promiseCache.delete(key);
        reject(err);
      }
    );
  });

  promiseCache.set(key, p);
  return p;
}

/** Staggered idle preloading so Dimension 2 sculptures are cached before arrival. */
export function preloadAllMuseumModels(lowBandwidth = false): void {
  if (typeof window === "undefined") return;
  const list = lowBandwidth ? PRELOAD_QUEUE.slice(0, 5) : PRELOAD_QUEUE;
  list.forEach((item, idx) => {
    window.setTimeout(() => {
      loadMuseumModel(item.name, item.finish).catch(() => {});
    }, 280 + idx * 180);
  });
}

/**
 * Loads a compressed CC0 Poly Haven 1K glTF model, normalizes its max
 * bounding dimension to 1m resting at y = 0, and eases in without popping.
 */
export function MuseumModel({
  name,
  finish = "marble",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 2.0,
}: {
  name: string;
  finish?: MuseumFinish;
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
}) {
  const key = `${name}:${finish}`;
  const [template, setTemplate] = useState<THREE.Group | null>(() => assetCache.get(key) ?? null);
  const groupRef = useRef<THREE.Group>(null);
  const revealRef = useRef(assetCache.has(key) ? 1 : 0.85);

  useEffect(() => {
    let active = true;
    const cached = assetCache.get(key);
    if (cached) {
      Promise.resolve().then(() => {
        if (active) setTemplate(cached);
      });
    } else {
      loadMuseumModel(name, finish)
        .then((grp) => {
          if (active) setTemplate(grp);
        })
        .catch((err) => {
          console.error(`Failed to load MuseumModel ${name}:`, err);
        });
    }
    return () => {
      active = false;
    };
  }, [key, name, finish]);

  useFrame((_, delta) => {
    if (template && groupRef.current && revealRef.current < 1) {
      revealRef.current = Math.min(1, revealRef.current + delta * 3.0);
      groupRef.current.scale.setScalar(height * revealRef.current);
    }
  });

  const instance = useMemo(() => (template ? template.clone() : null), [template]);

  if (!instance) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={height * revealRef.current}
    >
      <primitive object={instance} />
    </group>
  );
}
