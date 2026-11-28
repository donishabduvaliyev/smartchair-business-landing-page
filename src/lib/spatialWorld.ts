import * as THREE from "three";

export interface ProjectedAnchor {
  x: number;
  y: number;
  visible: boolean;
  dist: number;
}

export type OpsModuleId = "requests" | "queue" | "register" | "crm";

export interface SpatialWorldState {
  activeAct: number; // 0..4
  dimension: "salon" | "classical";
  chairMorph: number; // 0..1 during Act II metamorphosis
  hoveredAnchor: string | null;
  selectedCategory: string;
  selectedOpsModule: OpsModuleId;
  anchors: Record<string, ProjectedAnchor>;
}

export const WORLD_ANCHOR_POSITIONS: Record<string, [number, number, number]> = {
  threshold: [-3.2, -0.6, -12],
  chair: [0.0, 1.4, -74],
  discovery: [-6.5, 2.2, -210],
  operations: [0.0, 2.8, -296],
  reception: [0.0, -0.8, -438],
};

export const NICHE_LOOK_TARGETS: Record<string, [number, number, number]> = {
  barber: [-8.0, 0.8, -162],
  hair: [8.0, 0.8, -176],
  spa: [-8.0, 0.8, -198],
  massage: [-8.0, 0.8, -198],
  cosmetology: [8.0, 0.8, -216],
  nails: [-8.0, 0.8, -238],
  browsLashes: [8.0, 0.8, -252],
  makeup: [8.0, 0.8, -252],
};

export const OPS_LOOK_TARGETS: Record<OpsModuleId, [number, number, number]> = {
  requests: [-6.6, -3.8, -293],
  queue: [-6.6, -3.8, -300],
  register: [6.6, -3.8, -293],
  crm: [6.6, -3.8, -300],
};

export function createSpatialWorld(): SpatialWorldState {
  const anchors: Record<string, ProjectedAnchor> = {};
  Object.keys(WORLD_ANCHOR_POSITIONS).forEach((k) => {
    anchors[k] = { x: 0, y: 0, visible: false, dist: 999 };
  });
  return {
    activeAct: 0,
    dimension: "salon",
    chairMorph: 0,
    hoveredAnchor: null,
    selectedCategory: "barber",
    selectedOpsModule: "requests",
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
