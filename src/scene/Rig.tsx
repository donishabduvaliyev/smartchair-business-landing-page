import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { FOCUS_KEYS, SCENES } from "../content/scenes";
import type { ScrollState } from "../lib/useScroll";
import {
  NICHE_LOOK_TARGETS,
  OPS_LOOK_TARGETS,
  projectAnchors,
  type SpatialWorldState,
} from "../lib/spatialWorld";

interface Keyframe3 {
  p: number;
  v: readonly [number, number, number];
}

/**
 * Unbroken Fritsch-Carlson Monotone C1 Hermite Camera Spline (0.00 -> 1.00):
 *  - 0.00 -> 0.15: Enter World 1 salon toward Hero Chair
 *  - 0.15 -> 0.31: Smooth orbit around levitating Hero Chair during erosion
 *  - 0.31 -> 0.42: Pass straight through the Looking-Glass Mirror at z = -88.5 (uPortalVeil peak at 0.365)
 *  - 0.42 -> 1.00: Center-axis glide through the Braccio Nuovo gallery, right-aisle Rotunda bypass, & Apse
 */
const CAMERA_POS_KEYS: readonly Keyframe3[] = [
  { p: 0.0, v: [0.0, 0.2, 14.0] },
  { p: 0.08, v: [0.2, 0.15, -24.0] },
  { p: 0.15, v: [-2.4, 0.1, -60.5] },
  { p: 0.24, v: [0.6, 0.4, -62.5] },
  { p: 0.31, v: [1.4, 0.3, -66.0] },
  { p: 0.365, v: [0.0, 0.25, -95.0] },
  { p: 0.42, v: [0.0, 0.35, -122.0] },
  { p: 0.5, v: [0.0, 0.4, -172.0] },
  { p: 0.6, v: [0.0, 0.45, -232.0] },
  { p: 0.68, v: [0.8, 0.7, -268.0] },
  { p: 0.76, v: [2.8, 1.05, -296.0] },
  { p: 0.85, v: [0.6, 0.2, -352.0] },
  { p: 0.93, v: [0.0, -0.25, -392.0] },
  { p: 1.0, v: [0.0, -0.35, -404.0] },
];

const CAMERA_AIM_KEYS: readonly Keyframe3[] = [
  { p: 0.0, v: [0.0, -1.1, -60.0] },
  { p: 0.08, v: [0.0, -1.2, -74.0] },
  { p: 0.15, v: [0.0, -1.1, -76.0] },
  { p: 0.24, v: [0.0, -0.8, -82.0] },
  { p: 0.31, v: [0.0, -0.3, -92.0] },
  { p: 0.365, v: [0.0, 0.2, -135.0] },
  { p: 0.42, v: [0.0, 0.2, -178.0] },
  { p: 0.5, v: [0.0, 0.2, -228.0] },
  { p: 0.6, v: [0.0, 0.0, -286.0] },
  { p: 0.68, v: [0.0, -0.9, -298.0] },
  { p: 0.76, v: [0.4, -0.4, -345.0] },
  { p: 0.85, v: [0.0, 0.1, -410.0] },
  { p: 0.93, v: [0.0, 0.5, -438.0] },
  { p: 1.0, v: [0.0, 0.75, -441.0] },
];

interface PreparedMonotoneSpline {
  keys: readonly Keyframe3[];
  tangents: [number, number, number][];
}

function buildMonotoneSpline(keys: readonly Keyframe3[]): PreparedMonotoneSpline {
  const n = keys.length;
  const tangents: [number, number, number][] = Array.from({ length: n }, () => [0, 0, 0]);

  for (let axis = 0; axis < 3; axis++) {
    const d: number[] = [];
    for (let k = 0; k < n - 1; k++) {
      d.push((keys[k + 1].v[axis] - keys[k].v[axis]) / (keys[k + 1].p - keys[k].p));
    }
    tangents[0][axis] = d[0];
    tangents[n - 1][axis] = d[n - 2];

    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] <= 0) {
        tangents[i][axis] = 0;
      } else {
        const hPrev = keys[i].p - keys[i - 1].p;
        const hNext = keys[i + 1].p - keys[i].p;
        const w1 = 2 * hNext + hPrev;
        const w2 = hNext + 2 * hPrev;
        tangents[i][axis] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
      }
    }
  }

  return { keys, tangents };
}

function sampleMonotoneSpline(
  spline: PreparedMonotoneSpline,
  p: number,
  out: THREE.Vector3
) {
  const { keys, tangents } = spline;
  const n = keys.length;
  if (p <= keys[0].p) {
    out.set(keys[0].v[0], keys[0].v[1], keys[0].v[2]);
    return;
  }
  if (p >= keys[n - 1].p) {
    const last = keys[n - 1].v;
    out.set(last[0], last[1], last[2]);
    return;
  }

  let idx = 0;
  for (let i = 0; i < n - 1; i++) {
    if (p >= keys[i].p && p <= keys[i + 1].p) {
      idx = i;
      break;
    }
  }

  const h = keys[idx + 1].p - keys[idx].p;
  const t = (p - keys[idx].p) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const a = keys[idx].v;
  const b = keys[idx + 1].v;
  const ma = tangents[idx];
  const mb = tangents[idx + 1];

  out.set(
    h00 * a[0] + h10 * h * ma[0] + h01 * b[0] + h11 * h * mb[0],
    h00 * a[1] + h10 * h * ma[1] + h01 * b[1] + h11 * h * mb[1],
    h00 * a[2] + h10 * h * ma[2] + h01 * b[2] + h11 * h * mb[2]
  );
}

function focusAt(p: number) {
  for (let i = 0; i < FOCUS_KEYS.length - 1; i++) {
    const a = FOCUS_KEYS[i],
      b = FOCUS_KEYS[i + 1];
    if (p >= a.p && p <= b.p) {
      let t = (p - a.p) / (b.p - a.p);
      t = t * t * (3 - 2 * t);
      return a.d + (b.d - a.d) * t;
    }
  }
  return FOCUS_KEYS[FOCUS_KEYS.length - 1].d;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
}

const wob = (t: number, a: number, b: number, c: number) =>
  Math.sin(t * a) * 0.6 + Math.sin(t * b + 1.7) * 0.3 + Math.sin(t * c + 4.1) * 0.1;

export function Rig({
  scroll,
  pointer,
  reduced,
  focusRef,
  world,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<{ x: number; y: number; sx: number; sy: number }>;
  reduced: boolean;
  focusRef: React.RefObject<number>;
  world?: React.RefObject<SpatialWorldState>;
}) {
  const { camera, size } = useThree();
  const splines = useMemo(
    () => ({
      pos: buildMonotoneSpline(CAMERA_POS_KEYS),
      aim: buildMonotoneSpline(CAMERA_AIM_KEYS),
    }),
    []
  );

  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const gazeLook = useRef(new THREE.Vector3());
  const desiredVec = useRef(new THREE.Vector3());
  const gazeAlpha = useRef(0);
  const gazeClickP = useRef<number | null>(null);
  const fov = useRef(46);
  const focus = useRef(20);

  useFrame((state, delta) => {
    const s = scroll.current!;
    const pt = pointer.current!;
    const ease = reduced ? 1 : 1 - Math.pow(0.001, delta);

    s.smooth += (s.raw - s.smooth) * (reduced ? 1 : Math.min(ease * 0.9, 1));
    pt.sx += (pt.x - pt.sx) * Math.min(ease * 0.7, 1);
    pt.sy += (pt.y - pt.sy) * Math.min(ease * 0.7, 1);

    const p = Math.min(Math.max(s.smooth, 0), 1);

    sampleMonotoneSpline(splines.pos, p, pos.current);
    sampleMonotoneSpline(splines.aim, p, look.current);

    if (world?.current && !reduced) {
      if (world.current.userClickedGaze) {
        gazeClickP.current = p;
        world.current.userClickedGaze = false;
      }

      if (gazeClickP.current !== null && Math.abs(p - gazeClickP.current) > 0.035) {
        gazeClickP.current = null;
      }

      let targetArr: readonly [number, number, number] | null = null;
      let desiredAlpha = 0;

      if (gazeClickP.current !== null) {
        if (p >= 0.41 && p <= 0.61) {
          targetArr = NICHE_LOOK_TARGETS[world.current.selectedCategory] ?? null;
          desiredAlpha = targetArr ? 0.18 : 0;
        } else if (p >= 0.63 && p <= 0.75) {
          targetArr = OPS_LOOK_TARGETS[world.current.selectedOpsModule] ?? null;
          desiredAlpha = targetArr ? 0.18 : 0;
        }
      }

      gazeAlpha.current += (desiredAlpha - gazeAlpha.current) * Math.min(1, delta * 3.5);

      if (targetArr) {
        desiredVec.current.set(
          targetArr[0],
          Math.max(targetArr[1], -1.2),
          Math.min(targetArr[2], pos.current.z - 22)
        );
        if (gazeLook.current.lengthSq() < 0.001) {
          gazeLook.current.copy(desiredVec.current);
        } else {
          gazeLook.current.lerp(desiredVec.current, Math.min(1, delta * 3.5));
        }
      } else if (gazeAlpha.current > 0.0005) {
        gazeLook.current.lerp(look.current, Math.min(1, delta * 3.0));
      }

      if (gazeAlpha.current > 0.0005) {
        look.current.lerp(gazeLook.current, gazeAlpha.current);
      }
    }

    const t = state.clock.elapsedTime;
    const hx = reduced ? 0 : wob(t, 0.43, 0.97, 2.31) * 0.28;
    const hy = reduced ? 0 : wob(t + 11, 0.37, 1.13, 2.07) * 0.2;
    const hr = reduced ? 0 : wob(t + 23, 0.29, 0.83, 1.77) * 0.004;

    camera.position.set(
      pos.current.x + pt.sx * 1.6 + hx,
      pos.current.y - pt.sy * 1.1 + hy,
      pos.current.z
    );
    look.current.x += pt.sx * 2.4;
    look.current.y -= pt.sy * 1.6;
    camera.lookAt(look.current);
    camera.rotation.z += hr + pt.sx * 0.015;

    const active = SCENES.findIndex((sc) => p >= sc.a && p < sc.b);
    const idx = active < 0 ? SCENES.length - 1 : active;
    s.active = idx;

    const portalBell = smoothstep(0.3, 0.365, p) * (1 - smoothstep(0.365, 0.43, p));
    const baseFov = size.width < 768 ? 54 : 46;
    const targetFov = baseFov + portalBell * 8;
    fov.current += (targetFov - fov.current) * 0.05;
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov.current) > 0.01) {
      cam.fov = fov.current;
      cam.updateProjectionMatrix();
    }

    focus.current += (focusAt(p) - focus.current) * 0.035;
    (focusRef as React.MutableRefObject<number>).current = focus.current;

    if (world?.current) {
      world.current.activeAct =
        p < 0.14 ? 0 : p < 0.39 ? 1 : p < 0.62 ? 2 : p < 0.84 ? 3 : 4;
      world.current.dimension = p >= 0.365 ? "classical" : "salon";
      projectAnchors(camera, world.current, size.width, size.height);
    }
  }, 0);

  return null;
}
