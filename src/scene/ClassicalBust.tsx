import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY } from "./constants";
import { FOG_FN } from "./glsl";

interface CachedBustAsset {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
}

let cachedAsset: CachedBustAsset | null = null;
let loadPromise: Promise<CachedBustAsset> | null = null;

function makeBustMarbleMaterial(diffTex: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uDiff: { value: diffTex },
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
      varying vec2 vUv;
      varying vec3 vNorm;
      varying vec3 vViewDir;
      varying float vZ;
      void main() {
        vec3 n = normalize(vNorm);
        vec3 tex = texture2D(uDiff, vUv).rgb;
        float ao = clamp(dot(tex, vec3(0.333)) * 1.25, 0.48, 1.08);

        vec3 sun = normalize(vec3(0.42, 0.78, 0.48));
        float ndl = max(dot(n, sun), 0.0);
        float hemi = 0.64 + 0.38 * ndl;
        float rim = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 3.0) * 0.14;

        vec3 col = vec3(0.96, 0.93, 0.88) * ao * hemi + vec3(1.0, 0.96, 0.90) * rim;
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }
    `,
  });
}

function loadBustAsset(): Promise<CachedBustAsset> {
  if (cachedAsset) return Promise.resolve(cachedAsset);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const texLoader = new THREE.TextureLoader();

    const diffTex = texLoader.load("/models/marble_bust/textures/marble_bust_01_diff_1k.jpg");
    diffTex.flipY = false;

    loader.load(
      "/models/marble_bust/marble_bust_01_1k.gltf",
      (gltf) => {
        let extracted: THREE.BufferGeometry | null = null;
        gltf.scene.traverse((obj) => {
          if (!extracted && obj instanceof THREE.Mesh && obj.geometry) {
            extracted = obj.geometry.clone();
          }
        });

        if (!extracted) {
          reject(new Error("ClassicalMaleBust: no mesh geometry found in glTF."));
          return;
        }

        const geo: THREE.BufferGeometry = extracted;
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        if (bb) {
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          bb.getSize(size);
          bb.getCenter(center);

          const normScale = size.y > 0 ? 1 / size.y : 1;
          geo.translate(-center.x, -bb.min.y, -center.z);
          geo.scale(normScale, normScale, normScale);
          geo.computeBoundingBox();
        }
        geo.computeVertexNormals();

        const asset: CachedBustAsset = {
          geometry: geo,
          material: makeBustMarbleMaterial(diffTex),
        };
        cachedAsset = asset;
        resolve(asset);
      },
      undefined,
      (err) => {
        loadPromise = null;
        reject(err);
      }
    );
  });

  return loadPromise;
}

/**
 * Reusable CC0 Classical Curly-Haired Male Marble Bust shaded in
 * sunlit Carrara marble to match Dimension 2 without Three.js scene lights.
 */
export function ClassicalMaleBust({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 2.4,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
}) {
  const [asset, setAsset] = useState<CachedBustAsset | null>(cachedAsset);

  useEffect(() => {
    let active = true;
    if (!cachedAsset) {
      loadBustAsset()
        .then((res) => {
          if (active) setAsset(res);
        })
        .catch((err) => {
          console.error("Failed to load ClassicalMaleBust:", err);
        });
    }
    return () => {
      active = false;
    };
  }, []);

  if (!asset) return null;

  return (
    <mesh
      geometry={asset.geometry}
      material={asset.material}
      position={position}
      rotation={rotation}
      scale={height}
    />
  );
}
