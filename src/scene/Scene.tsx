import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Architecture } from "./Architecture";
import { Furniture } from "./Furniture";
import { Practicals, Mirrors, Fan, Dust } from "./Fixtures";
import { HeroChairPortal } from "./HeroChairPortal";
import { PostPortalWorld } from "./PostPortalWorld";
import { SpatialTypography } from "./SpatialTypography";
import { Rig } from "./Rig";
import { Post } from "./Post";
import { buildShop } from "./shop";
import { preloadClassicalBust } from "./ClassicalBust";
import { preloadAllMuseumModels } from "./MuseumModel";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY, FOG_COLOR, FOG_DENSITY } from "./constants";
import { isLowEndOrSlowNetwork, type ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const SALON_CLEAR = new THREE.Color(0x05070a);
const DAY_CLEAR = new THREE.Color(0xf5efe6);

function DimensionDirector({
  scroll,
  world1Ref,
  world2Ref,
}: {
  scroll: React.RefObject<ScrollState>;
  world1Ref: React.RefObject<THREE.Group | null>;
  world2Ref: React.RefObject<THREE.Group | null>;
}) {
  const { gl, scene } = useThree();
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const p = scroll.current?.smooth ?? 0;
    if (world1Ref.current) world1Ref.current.visible = p < 0.385;
    if (world2Ref.current) world2Ref.current.visible = p > 0.345;

    const t = Math.min(Math.max((p - 0.35) / 0.04, 0), 1);
    const daylight = t * t * (3 - 2 * t);

    tmpColor.copy(SALON_CLEAR).lerp(DAY_CLEAR, daylight);
    gl.setClearColor(tmpColor, 1);

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(FOG_COLOR).lerp(ALABASTER_FOG, daylight);
      scene.fog.density = FOG_DENSITY + (ALABASTER_FOG_DENSITY - FOG_DENSITY) * daylight;
    }
  });

  return null;
}

// The look was authored before three enabled colour management by
// default. Leaving it on re-interprets every literal colour and the
// whole grade shifts. Keep it off.
THREE.ColorManagement.enabled = false;

/**
 * Measured, not guessed: drop resolution in two steps if frames slip,
 * climb back up if they recover, and bail out of WebGL entirely if a
 * device is stuck at the floor and still can't hold a usable frame rate.
 */
function PerfGuard({
  onTierChange, onCritical,
}: { onTierChange: (tier: number) => void; onCritical: () => void }) {
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ frames: 0, time: 0, step: 0, good: 0, bad: 0 });

  useFrame((_, delta) => {
    const a = acc.current;
    a.frames++; a.time += delta;
    if (a.time < 1) return;
    const fps = a.frames / a.time;
    a.frames = 0; a.time = 0;
    const cap = Math.min(window.devicePixelRatio || 1, 1.75);

    if (fps < 40 && a.step === 0) {
      a.step = 1; a.good = 0;
      setDpr(Math.max(1, cap * 0.75));
      onTierChange(1);
    } else if (fps < 32 && a.step === 1) {
      a.step = 2; a.good = 0;
      setDpr(1);
      onTierChange(2);
    } else if (fps >= 48 && a.step > 0) {
      // recovery is deliberately slower than the drop: a few seconds of
      // real headroom, not one lucky frame, before quality climbs back
      a.good++;
      if (a.good >= 4) {
        a.step--; a.good = 0;
        setDpr(a.step === 0 ? cap : Math.max(1, cap * 0.75));
        onTierChange(a.step);
      }
    } else {
      a.good = 0;
    }

    // already at the floor and still under 24fps for five seconds
    // straight: the 3D take itself is too much for this device
    if (a.step === 2 && fps < 24) {
      a.bad++;
      if (a.bad >= 5) onCritical();
    } else {
      a.bad = 0;
    }
  }, 2);
  return null;
}

/** Baseline particle budget for a full-quality run, scaled down per tier below. */
function dustBudget(base: number, tier: number) {
  if (tier <= 0) return base;
  return Math.round(base * (tier === 1 ? 0.6 : 0.35));
}

export function Scene({
  scroll, pointer, reduced, onCriticalPerf, focusRef: externalFocusRef, world, compact = false, onOpenConnect,
}: {
  scroll: React.RefObject<ScrollState>;
  pointer: React.RefObject<{ x: number; y: number; sx: number; sy: number }>;
  reduced: boolean;
  onCriticalPerf: () => void;
  focusRef?: React.RefObject<number>;
  world: React.RefObject<SpatialWorldState>;
  compact?: boolean;
  onOpenConnect?: () => void;
}) {
  const shop = useMemo(() => buildShop(), []);
  const internalFocusRef = useRef(16);
  const focusRef = externalFocusRef ?? internalFocusRef;
  const world1Ref = useRef<THREE.Group>(null);
  const world2Ref = useRef<THREE.Group>(null);
  const [lowEnd] = useState(isLowEndOrSlowNetwork);
  const isLite = compact || lowEnd;
  const baseCount = useRef(isLite || window.innerWidth < 900 ? 1100 : 3800).current;
  const [tier, setTier] = useState(0);
  const count = dustBudget(baseCount, tier);

  useEffect(() => {
    preloadClassicalBust();
    preloadAllMuseumModels(isLite);
  }, [isLite]);

  return (
    <Canvas
      id="stage"
      flat
      dpr={[1, isLite ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: compact ? 54 : 46, near: 0.5, far: 700, position: [0, 0.2, 14] }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x05070a, 1);
        scene.fog = new THREE.FogExp2(FOG_COLOR.getHex(), FOG_DENSITY);
      }}
    >
      <DimensionDirector scroll={scroll} world1Ref={world1Ref} world2Ref={world2Ref} />

      <group ref={world1Ref}>
        <Architecture />
        <Furniture boxes={shop.boxes} cyls={shop.cyls} taps={shop.taps} />
        <HeroChairPortal scroll={scroll} world={world} reduced={reduced} compact={isLite} />
        <Mirrors items={shop.mirrors} />
        <Practicals items={shop.practicals} />
        <Fan at={shop.fanAt} />
      </group>

      <group ref={world2Ref} visible={false}>
        <PostPortalWorld scroll={scroll} world={world} onOpenConnect={onOpenConnect} />
      </group>

      <SpatialTypography scroll={scroll} />
      <Dust count={count} />

      <Rig scroll={scroll} pointer={pointer} reduced={reduced} focusRef={focusRef} world={world} />
      <Post focusRef={focusRef} reduced={reduced} scroll={scroll} />
      <PerfGuard onTierChange={setTier} onCritical={onCriticalPerf} />
    </Canvas>
  );
}
