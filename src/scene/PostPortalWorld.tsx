import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C, FLOOR_Y, FOG_COLOR, FOG_DENSITY } from "./constants";
import { FOG_FN, VERT_WORLD } from "./glsl";
import { shade } from "./shade";
import type { ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const MONOLITHS = [
  { key: "barber", pos: [-9.5, -0.5, -152] as [number, number, number], ry: 0.38 },
  { key: "hair", pos: [-4.0, 0.4, -172] as [number, number, number], ry: 0.16 },
  { key: "nails", pos: [2.5, -0.2, -188] as [number, number, number], ry: -0.14 },
  { key: "spa", pos: [8.5, 0.6, -202] as [number, number, number], ry: -0.36 },
  { key: "cosmetology", pos: [-6.8, -0.4, -214] as [number, number, number], ry: 0.28 },
  { key: "makeup", pos: [0.5, 0.5, -226] as [number, number, number], ry: 0.0 },
] as const;

const SLAB_COUNT = 16;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * World 2 — The Smoked-Obsidian Mirror Horizon:
 * Emerges after flying through the Hero Chair Particle Portal (z < -102).
 * Houses raycasted 3D Category Monoliths, the Horological 3D Clock Ring
 * with 16 snapping appointment slabs, and the sculpted Fluted-Walnut Reception Desk.
 */
export function PostPortalWorld({
  scroll,
  world,
  onSelectCategory,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  onSelectCategory?: (key: string) => void;
}) {
  const monolithRefs = useRef<(THREE.Group | null)[]>([]);
  const clockRingRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const slabRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { floorMat, archMat, brassMat, walnutMat, darkMat, slabGeo, fluteAngles, slabSeeds } =
    useMemo(() => {
      const fMat = new THREE.ShaderMaterial({
        uniforms: {
          uFogCol: { value: FOG_COLOR },
          uFogDen: { value: FOG_DENSITY * 0.85 },
        },
        vertexShader: VERT_WORLD,
        fragmentShader: /* glsl */ `
          ${FOG_FN}
          varying vec3 vP;
          varying float vZ;
          void main() {
            // Mirror-obsidian floor with crisp brass runway hairlines & radial rings
            vec2 p = vP.xy;
            float distCenter = abs(p.x);
            float runway = smoothstep(0.06, 0.0, abs(distCenter - 7.5)) * 0.45
                         + smoothstep(0.05, 0.0, abs(distCenter - 15.0)) * 0.22;

            // Subtle longitudinal grid lines
            float gx = smoothstep(0.035, 0.0, min(fract(p.x * 0.125), 1.0 - fract(p.x * 0.125)));
            float gz = smoothstep(0.035, 0.0, min(fract(p.y * 0.0625), 1.0 - fract(p.y * 0.0625)));

            // Radial champagne ripples around Clock Ring (y ~ -292) & Reception (y ~ -438)
            float rClock = length(vec2(p.x, p.y + 292.0));
            float ringC = smoothstep(0.14, 0.0, abs(fract(rClock * 0.12) - 0.5)) * smoothstep(26.0, 2.0, rClock);

            float rDesk = length(vec2(p.x, p.y + 438.0));
            float ringD = smoothstep(0.14, 0.0, abs(fract(rDesk * 0.16) - 0.5)) * smoothstep(22.0, 2.0, rDesk);

            vec3 base = vec3(0.025, 0.027, 0.034);
            vec3 brass = vec3(0.83, 0.68, 0.35);
            vec3 col = base
                     + brass * (runway + (gx + gz) * 0.08 + ringC * 0.35 + ringD * 0.48);

            // Soft reflection pool under arches & reception desk
            float pool = exp(-pow(p.x / 10.0, 2.0)) * 0.06;
            col += vec3(0.75, 0.60, 0.32) * pool;

            gl_FragColor = vec4(applyFog(col, vZ), 1.0);
          }
        `,
      });

      const sGeo = shade(new THREE.BoxGeometry(1.7, 0.38, 0.18));
      const fAngles = Array.from({ length: 22 }, (_, i) => (i - 10.5) * 0.32);

      // Deterministic scattered start positions for the 16 appointment slabs
      const seeds = Array.from({ length: SLAB_COUNT }, (_, i) => {
        const s1 = ((i * 137.5 + 17) % 100) / 100;
        const s2 = ((i * 293.1 + 53) % 100) / 100;
        const s3 = ((i * 419.7 + 89) % 100) / 100;
        return {
          sx: (s1 - 0.5) * 26,
          sy: (s2 - 0.3) * 14,
          sz: (s3 - 0.5) * 32,
          rx: (s1 - 0.5) * 1.8,
          ry: (s2 - 0.5) * 2.4,
        };
      });

      return {
        floorMat: fMat,
        archMat: new THREE.MeshBasicMaterial({ color: 0x181b22, fog: true }),
        brassMat: new THREE.MeshBasicMaterial({ color: C.CHROME, fog: true }),
        walnutMat: new THREE.MeshBasicMaterial({ color: C.WOOD, fog: true }),
        darkMat: new THREE.MeshBasicMaterial({ color: C.DARK, fog: true }),
        slabGeo: sGeo,
        fluteAngles: fAngles,
        slabSeeds: seeds,
      };
    }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current?.smooth ?? 0;

    // Gentle zero-G float & hover reaction on Category Monoliths
    monolithRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const spec = MONOLITHS[idx];
      const isSelected = world.current?.selectedCategory === spec.key;
      const targetY = spec.pos[1] + Math.sin(t * 0.9 + idx * 1.1) * 0.28 + (isSelected ? 0.65 : 0);
      grp.position.y += (targetY - grp.position.y) * 0.08;
      const s = isSelected ? 1.08 : 1.0;
      grp.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    });

    // Horological Clock Ring rotation & 16 snapping appointment slabs (0.56 -> 0.76)
    const snap = smoothstep(0.56, 0.74, p);
    if (clockRingRef.current) {
      clockRingRef.current.rotation.z = t * 0.06;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 0.35 - p * 12.0;
    }

    slabRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const seed = slabSeeds[i];
      const angle = (i / SLAB_COUNT) * Math.PI * 2;
      const ringR = 4.5;
      const tx = Math.cos(angle) * ringR;
      const ty = Math.sin(angle) * ringR;
      const tz = 0;

      mesh.position.set(
        seed.sx + (tx - seed.sx) * snap,
        seed.sy + (ty - seed.sy) * snap,
        seed.sz + (tz - seed.sz) * snap
      );
      mesh.rotation.set(
        seed.rx * (1 - snap),
        seed.ry * (1 - snap),
        angle * snap
      );
    });
  });

  return (
    <group>
      {/* Expansive Smoked-Obsidian Mirror Horizon Floor */}
      <mesh
        material={floorMat}
        position={[0, FLOOR_Y, -295]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[240, 396]} />
      </mesh>

      {/* Monumental Architectural Arches */}
      {[-114, -185, -265, -365].map((z) => (
        <group key={z} position={[0, FLOOR_Y, z]}>
          <mesh material={archMat} position={[-16, 11, 0]}>
            <boxGeometry args={[1.1, 22, 1.4]} />
          </mesh>
          <mesh material={archMat} position={[16, 11, 0]}>
            <boxGeometry args={[1.1, 22, 1.4]} />
          </mesh>
          <mesh material={archMat} position={[0, 22, 0]}>
            <boxGeometry args={[33.1, 1.0, 1.4]} />
          </mesh>
          {/* Thin Champagne Brass inner reveal */}
          <mesh material={brassMat} position={[0, 21.42, 0]}>
            <boxGeometry args={[31.0, 0.08, 1.44]} />
          </mesh>
        </group>
      ))}

      {/* Act III — 6 Raycasted 3D Category Monoliths */}
      {MONOLITHS.map((m, idx) => (
        <group
          key={m.key}
          ref={(el) => {
            monolithRefs.current[idx] = el;
          }}
          position={m.pos}
          rotation={[0, m.ry, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (world.current) world.current.selectedCategory = m.key;
            onSelectCategory?.(m.key);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (world.current) world.current.hoveredAnchor = m.key;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            if (world.current) world.current.hoveredAnchor = null;
            document.body.style.cursor = "";
          }}
        >
          {/* Dark Obsidian Mirror Slab */}
          <mesh material={darkMat}>
            <boxGeometry args={[3.4, 5.6, 0.24]} />
          </mesh>
          {/* Brass Perimeter Frame */}
          <mesh material={brassMat} position={[0, 2.84, 0]}>
            <boxGeometry args={[3.5, 0.08, 0.28]} />
          </mesh>
          <mesh material={brassMat} position={[0, -2.84, 0]}>
            <boxGeometry args={[3.5, 0.08, 0.28]} />
          </mesh>
        </group>
      ))}

      {/* Act IV — Horological 3D Clock Ring & 16 Snapping Appointment Slabs */}
      <group position={[0, 0.2, -292]}>
        <group ref={clockRingRef}>
          <mesh material={brassMat}>
            <torusGeometry args={[5.6, 0.08, 12, 64]} />
          </mesh>
          <mesh material={archMat}>
            <torusGeometry args={[6.1, 0.12, 12, 64]} />
          </mesh>
        </group>
        {/* Sweeping Brass Clock Hand */}
        <mesh ref={minuteHandRef} material={brassMat} position={[0, 0, 0.1]}>
          <boxGeometry args={[0.11, 3.8, 0.08]} />
        </mesh>

        {/* 16 Scattered -> Snapping Appointment Slabs */}
        {slabSeeds.map((_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              slabRefs.current[i] = el;
            }}
            geometry={slabGeo}
            material={i % 4 === 0 ? brassMat : darkMat}
          />
        ))}
      </group>

      {/* Act V — Center-Stage Fluted-Walnut & Brass Reception Desk (z = -438) */}
      <group position={[0, FLOOR_Y, -438]}>
        {/* Main Walnut Body */}
        <mesh material={walnutMat} position={[0, 1.5, 0]}>
          <boxGeometry args={[7.6, 3.0, 2.2]} />
        </mesh>
        {/* 22 Vertical Architectural Walnut Flutes */}
        {fluteAngles.map((fx, i) => (
          <mesh key={i} material={brassMat} position={[fx, 1.5, 1.12]}>
            <boxGeometry args={[0.06, 2.7, 0.08]} />
          </mesh>
        ))}
        {/* Cantilevered Brushed-Brass Top Slab */}
        <mesh material={brassMat} position={[0, 3.08, 0]}>
          <boxGeometry args={[8.1, 0.16, 2.5]} />
        </mesh>
        {/* Glowing Champagne Under-Counter Reveal */}
        <mesh position={[0, 2.94, 1.14]}>
          <planeGeometry args={[7.8, 0.09]} />
          <meshBasicMaterial color={0xffe69c} />
        </mesh>
        {/* Monumental Back Halo Arch */}
        <mesh material={brassMat} position={[0, 7.2, -5.5]}>
          <torusGeometry args={[6.2, 0.07, 12, 64, Math.PI]} />
        </mesh>
      </group>
    </group>
  );
}
