import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { shade } from "./shade";
import { FOG_COLOR, FOG_DENSITY } from "./constants";
import { FOG_FN } from "./glsl";
import { loadRawSalonAsset, type SalonRawAsset } from "./MuseumModel";
import { makeSoftSculptedBoxGeo } from "./sculptedGeometries";
import type { Box, Cyl, SalonChairPlacement } from "./shop";

/**
 * Every softened millwork block, cylinder, and instanced sculpted salon chair
 * batched by colour/type into minimal draw calls.
 */
function useBatch<T extends { c: number }>(items: T[]) {
  return useMemo(() => {
    const byColour = new Map<number, T[]>();
    items.forEach((it) => {
      const arr = byColour.get(it.c) ?? [];
      arr.push(it);
      byColour.set(it.c, arr);
    });
    return [...byColour.entries()];
  }, [items]);
}

function Instances({
  geo, colour, items, kind,
}: {
  geo: THREE.BufferGeometry;
  colour: number;
  items: (Box | Cyl)[];
  kind: "box" | "round";
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    items.forEach((it, i) => {
      e.set(it.rx, it.ry, 0);
      q.setFromEuler(e);
      const s =
        kind === "box"
          ? new THREE.Vector3(...(it as Box).s)
          : new THREE.Vector3((it as Cyl).r, (it as Cyl).h, (it as Cyl).r);
      m4.compose(new THREE.Vector3(...it.p), q, s);
      mesh.setMatrixAt(i, m4);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items, kind]);

  return (
    <instancedMesh ref={ref} args={[geo, undefined, items.length]} frustumCulled={false}>
      <meshBasicMaterial attach="material" color={colour} vertexColors fog />
    </instancedMesh>
  );
}

function SalonChairsInstances({ chairs }: { chairs: SalonChairPlacement[] }) {
  const [asset, setAsset] = useState<SalonRawAsset | null>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    let active = true;
    loadRawSalonAsset("BarberShopChair_01")
      .then((a) => {
        if (active) setAsset(a);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const mat = useMemo(() => {
    const tex = asset?.diffTex ?? null;
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uDiff: { value: tex },
        uHasDiff: { value: tex ? 1.0 : 0.0 },
        uFogCol: { value: FOG_COLOR },
        uFogDen: { value: FOG_DENSITY },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNorm;
        varying vec3 vLocal;
        varying float vZ;
        void main() {
          vUv = uv;
          vLocal = position;
          mat4 instMat = modelMatrix * instanceMatrix;
          vec4 wp = instMat * vec4(position, 1.0);
          vNorm = normalize(mat3(instMat) * normal);
          vec4 mv = viewMatrix * wp;
          vZ = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        uniform sampler2D uDiff;
        uniform float uHasDiff;
        varying vec2 vUv;
        varying vec3 vNorm;
        varying vec3 vLocal;
        varying float vZ;
        void main() {
          vec3 n = normalize(vNorm);
          float key = max(n.y, 0.0);
          float fill = max(n.x * 0.6 + n.z * 0.5, 0.0);
          float ao = 0.92;
          if (uHasDiff > 0.5) {
            vec3 t = texture2D(uDiff, vUv).rgb;
            ao = clamp(dot(t, vec3(0.333)) * 1.25, 0.38, 1.05);
          }

          // Chrome/brass base vs cognac Italian leather seat & backrest
          float isBase = 1.0 - smoothstep(0.28, 0.34, vLocal.y);
          vec3 leather = vec3(0.42, 0.24, 0.16);
          vec3 brass = vec3(0.84, 0.69, 0.36);
          vec3 baseCol = mix(leather, brass, isBase);
          vec3 col = baseCol * ao * (0.48 + key * 0.72 + fill * 0.28);
          gl_FragColor = vec4(applyFog(col, vZ), 1.0);
        }
      `,
    });
  }, [asset]);

  useEffect(() => () => mat.dispose(), [mat]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !asset || chairs.length === 0) return;
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3(6.2, 6.2, 6.2);
    chairs.forEach((ch, i) => {
      e.set(0, -ch.yaw, 0);
      q.setFromEuler(e);
      m4.compose(new THREE.Vector3(...ch.p), q, s);
      mesh.setMatrixAt(i, m4);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [asset, chairs]);

  if (!asset || chairs.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[asset.geometry, mat, chairs.length]}
      frustumCulled={false}
    />
  );
}

export function Furniture({
  boxes,
  cyls,
  taps,
  chairs = [],
}: {
  boxes: Box[];
  cyls: Cyl[];
  taps: Cyl[];
  chairs?: SalonChairPlacement[];
}) {
  const geos = useMemo(
    () => ({
      box: shade(makeSoftSculptedBoxGeo()),
      cyl: shade(new THREE.CylinderGeometry(1, 1, 1, 16)),
      tap: shade(new THREE.CylinderGeometry(1, 0.42, 1, 18)),
    }),
    []
  );

  const boxBatches = useBatch(boxes);
  const cylBatches = useBatch(cyls);
  const tapBatches = useBatch(taps);

  return (
    <group>
      {boxBatches.map(([c, items]) => (
        <Instances key={`b${c}`} geo={geos.box} colour={c} items={items} kind="box" />
      ))}
      {cylBatches.map(([c, items]) => (
        <Instances key={`c${c}`} geo={geos.cyl} colour={c} items={items} kind="round" />
      ))}
      {tapBatches.map(([c, items]) => (
        <Instances key={`t${c}`} geo={geos.tap} colour={c} items={items} kind="round" />
      ))}
      <SalonChairsInstances chairs={chairs} />
    </group>
  );
}
