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

/**
 * Piecewise-choreographed camera rig:
 *  - 0.00 -> 0.14: Enter World 1 barbershop toward the center-stage Hero Chair
 *  - 0.14 -> 0.34: Dedicated orbital hold around the chair during surface erosion
 *  - 0.34 -> 0.42: Fly straight through the 3D Particle Portal Vortex (z = -88)
 *  - 0.42 -> 1.00: Glide across World 2 horizon to the Reception Desk (z = -438)
 */
const FLIGHT_WORLD1 = [
  [0.0, 0.2, 14],
  [0.6, 0.2, -14],
  [0.2, 0.1, -46],
  [-2.969, 0.0, -62.373],
] as const;

const FLIGHT_WORLD2 = [
  [0.0, 0.2, -108],
  [1.8, 0.4, -155],
  [4.5, 0.3, -210],
  [2.2, 0.4, -260],
  [0.0, 0.3, -315],
  [0.0, 0.2, -370],
  [0.0, -0.4, -418],
  [0.0, -1.2, -424],
] as const;

const AIM_WORLD2 = [
  [0.0, 0.0, -145],
  [-4.0, 0.8, -195],
  [-5.5, 0.6, -235],
  [-4.0, 0.4, -280],
  [0.0, 0.2, -340],
  [0.0, -0.4, -395],
  [0.0, -0.6, -438],
  [0.0, -0.4, -442],
] as const;

function focusAt(p: number) {
  for (let i = 0; i < FOCUS_KEYS.length - 1; i++) {
    const a = FOCUS_KEYS[i], b = FOCUS_KEYS[i + 1];
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
  scroll, pointer, reduced, focusRef, world,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<{ x: number; y: number; sx: number; sy: number }>;
  reduced: boolean;
  focusRef: React.RefObject<number>;
  world?: React.RefObject<SpatialWorldState>;
}) {
  const { camera, size } = useThree();
  const curves = useMemo(
    () => ({
      w1: new THREE.CatmullRomCurve3(FLIGHT_WORLD1.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.35),
      w2: new THREE.CatmullRomCurve3(FLIGHT_WORLD2.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.3),
      aim2: new THREE.CatmullRomCurve3(AIM_WORLD2.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.3),
    }),
    []
  );
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const gazeLook = useRef(new THREE.Vector3());
  const gazeAlpha = useRef(0);
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

    if (p < 0.14) {
      // Act I: Smooth walk through Reception into Hair-Cutting Floor (C0/C1 matched to Orbit start)
      const t1 = p / 0.14;
      const eLook = t1 * t1 * (3 - 2 * t1);
      curves.w1.getPointAt(t1, pos.current);
      look.current.set(0.0, -1.6 + eLook * 0.1, -74 - eLook * 6);
    } else if (p < 0.33) {
      // Act II Hold: Orbital arc inside +/-12.5m Hair-Cutting Floor framing Hero Chair & Mirror
      const tOrbit = (p - 0.14) / 0.19;
      const eased = tOrbit * tOrbit * (3 - 2 * tOrbit);
      const angle = -0.25 + eased * 0.68;
      const radius = 12.0 - eased * 1.8;
      pos.current.set(
        Math.sin(angle) * radius,
        0.0 + Math.sin(eased * Math.PI) * 0.65,
        -74 + Math.cos(angle) * radius
      );
      look.current.set(0.0, -1.5 + eased * 1.1, -80 - eased * 16);
    } else if (p < 0.40) {
      // Looking-Glass Mirror Teleport: C0/C1 matched at both ends (z=-64.7 -> z=-108.0)
      const tFly = (p - 0.33) / 0.07;
      const eased = tFly * tFly * (3 - 2 * tFly);
      const startAngle = -0.25 + 0.68;
      const sx = Math.sin(startAngle) * 10.2;
      const sz = -74 + Math.cos(startAngle) * 10.2;
      pos.current.set(
        sx * (1 - eased),
        0.2 * eased,
        sz + (-108 - sz) * eased
      );
      look.current.set(0.0, -0.4 * (1 - eased), -96 - eased * 49);
    } else {
      // World 2 Sunlit Classical Atelier: 0.40 -> 1.00
      const t2 = Math.min(1, (p - 0.40) / 0.60);
      curves.w2.getPointAt(t2, pos.current);
      curves.aim2.getPointAt(t2, look.current);

      if (world?.current && !reduced) {
        let targetArr: readonly [number, number, number] | null = null;
        let desiredAlpha = 0;
        if (p >= 0.41 && p <= 0.62) {
          targetArr = NICHE_LOOK_TARGETS[world.current.selectedCategory] ?? null;
          desiredAlpha = 0.28;
        } else if (p >= 0.63 && p <= 0.84) {
          targetArr = OPS_LOOK_TARGETS[world.current.selectedOpsModule] ?? null;
          desiredAlpha = 0.28;
        }
        gazeAlpha.current += (desiredAlpha - gazeAlpha.current) * 0.04;
        if (targetArr) {
          const desiredVec = new THREE.Vector3(targetArr[0], targetArr[1], targetArr[2]);
          if (gazeLook.current.lengthSq() < 0.001) gazeLook.current.copy(desiredVec);
          gazeLook.current.lerp(desiredVec, 0.05);
          look.current.lerp(gazeLook.current, gazeAlpha.current);
        }
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
    const portalBell = smoothstep(0.31, 0.36, p) * (1 - smoothstep(0.38, 0.45, p));
    const baseFov = (2 * Math.atan(24 / (2 * SCENES[idx].lens)) * 180) / Math.PI + 18;
    const targetFov = baseFov + portalBell * 10;
    fov.current += (targetFov - fov.current) * 0.04;
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
      world.current.dimension = p >= 0.37 ? "classical" : "salon";
      projectAnchors(camera, world.current, size.width, size.height);
    }
  }, 0);

  return null;
}
