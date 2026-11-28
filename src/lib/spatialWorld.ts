import * as THREE from "three";

export interface ProjectedAnchor {
  x: number;
  y: number;
  visible: boolean;
  dist: number;
}

export interface SpatialWorldState {
  activeAct: number; // 0..4
  chairMorph: number; // 0..1 during Act II metamorphosis
  hoveredAnchor: string | null;
  selectedCategory: string;
  anchors: Record<string, ProjectedAnchor>;
}

export const WORLD_ANCHOR_POSITIONS: Record<string, [number, number, number]> = {
  threshold: [-3.2, -0.6, -12],
  chair: [0.0, 1.4, -74],
  discovery: [-5.5, 2.2, -225],
  operations: [-5.5, 1.2, -292],
  reception: [0.0, -0.8, -438],
};

export function createSpatialWorld(): SpatialWorldState {
  const anchors: Record<string, ProjectedAnchor> = {};
  Object.keys(WORLD_ANCHOR_POSITIONS).forEach((k) => {
    anchors[k] = { x: 0, y: 0, visible: false, dist: 999 };
  });
  return {
    activeAct: 0,
    chairMorph: 0,
    hoveredAnchor: null,
    selectedCategory: "barber",
    anchors,
  };
}

/** Scroll targets (0..1) for the 5-Act Spatial Compass */
export const ACT_SCROLL_TARGETS = [
  { id: "threshold", act: 0, p: 0.0 },
  { id: "chair", act: 1, p: 0.24 },
  { id: "discovery", act: 2, p: 0.48 },
  { id: "operations", act: 3, p: 0.72 },
  { id: "reception", act: 4, p: 0.97 },
] as const;

export function scrollToProgress(p: number) {
  if (typeof window === "undefined") return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({
    top: Math.max(0, Math.min(max, max * p)),
    behavior: "smooth",
  });
}

const _v = new THREE.Vector3();

export function projectAnchors(
  camera: THREE.Camera,
  world: SpatialWorldState,
  width: number,
  height: number
) {
  Object.entries(WORLD_ANCHOR_POSITIONS).forEach(([key, [ax, ay, az]]) => {
    _v.set(ax, ay, az);
    const dist = camera.position.distanceTo(_v);
    _v.project(camera);
    const visible = _v.z > -1 && _v.z < 1 && dist < 110;
    world.anchors[key].x = (_v.x * 0.5 + 0.5) * width;
    world.anchors[key].y = (-_v.y * 0.5 + 0.5) * height;
    world.anchors[key].visible = visible;
    world.anchors[key].dist = dist;
  });
}
