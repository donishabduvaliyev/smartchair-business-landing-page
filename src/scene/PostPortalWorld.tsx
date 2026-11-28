import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ALABASTER_FOG, ALABASTER_FOG_DENSITY, C, FLOOR_Y } from "./constants";
import { FOG_FN, VERT_WORLD } from "./glsl";
import { shade } from "./shade";
import { ClassicalMaleBust } from "./ClassicalBust";
import type { ScrollState } from "../lib/useScroll";
import type { SpatialWorldState } from "../lib/spatialWorld";

const PLINTHS = [
  { key: "barber", pos: [-9.2, FLOOR_Y, -162] as [number, number, number], ry: 0.34 },
  { key: "hair", pos: [-4.2, FLOOR_Y, -180] as [number, number, number], ry: 0.16 },
  { key: "nails", pos: [3.6, FLOOR_Y, -194] as [number, number, number], ry: -0.14 },
  { key: "spa", pos: [8.8, FLOOR_Y, -210] as [number, number, number], ry: -0.34 },
  { key: "cosmetology", pos: [-6.4, FLOOR_Y, -222] as [number, number, number], ry: 0.24 },
  { key: "browsLashes", pos: [1.2, FLOOR_Y, -236] as [number, number, number], ry: 0.0 },
] as const;

const SLAB_COUNT = 16;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function makeClassicalStoneMat(baseHex: number, veinStrength = 0.08): THREE.ShaderMaterial {
  const c = new THREE.Color(baseHex);
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: c },
      uVein: { value: veinStrength },
      uFogCol: { value: ALABASTER_FOG },
      uFogDen: { value: ALABASTER_FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNorm = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * wp;
        vZ = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FOG_FN}
      uniform vec3 uBase;
      uniform float uVein;
      varying vec3 vWorld;
      varying vec3 vNorm;
      varying float vZ;
      void main() {
        vec3 sunDir = normalize(vec3(0.45, 0.85, 0.35));
        float ndl = max(dot(normalize(vNorm), sunDir), 0.0);
        float hemi = 0.70 + 0.30 * ndl;
        float vein = sin(vWorld.x * 0.7 + vWorld.y * 1.1 + sin(vWorld.z * 0.45) * 2.2) * 0.5 + 0.5;
        vec3 col = uBase * hemi * (1.0 - vein * uVein);
        gl_FragColor = vec4(applyFog(col, vZ), 1.0);
      }
    `,
  });
}

function GroomingEmblem({
  kind,
  marbleMat,
  bronzeMat,
  travertineMat,
  glassMat,
}: {
  kind: (typeof PLINTHS)[number]["key"];
  marbleMat: THREE.Material;
  bronzeMat: THREE.Material;
  travertineMat: THREE.Material;
  glassMat: THREE.Material;
}) {
  if (kind === "barber") {
    return (
      <group>
        {/* Real CC0 Curly-Haired Classical Male Marble Bust */}
        <ClassicalMaleBust position={[-0.18, 3.62, 0]} height={2.55} />

        {/* Articulated Antique-Bronze Barber Shears */}
        <group position={[0.92, 4.95, 0.35]}>
          <mesh material={bronzeMat} position={[0, 0.2, 0]} rotation={[0, 0, 0.32]}>
            <boxGeometry args={[0.09, 1.55, 0.04]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 0.2, 0.04]} rotation={[0, 0, -0.32]}>
            <boxGeometry args={[0.09, 1.55, 0.04]} />
          </mesh>
          <mesh material={marbleMat} position={[0, 0.25, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
          </mesh>
          <mesh material={bronzeMat} position={[-0.36, -0.68, 0]}>
            <torusGeometry args={[0.18, 0.04, 10, 24]} />
          </mesh>
          <mesh material={bronzeMat} position={[0.36, -0.68, 0.04]}>
            <torusGeometry args={[0.18, 0.04, 10, 24]} />
          </mesh>
          <mesh material={bronzeMat} position={[0.52, -0.84, 0.04]} rotation={[0, 0, -0.6]}>
            <boxGeometry args={[0.04, 0.24, 0.04]} />
          </mesh>
        </group>
      </group>
    );
  }
  if (kind === "hair") {
    return (
      <group>
        {/* Beveled Bronze Oval Vanity Mirror + Sculpted Wide-Tooth Styling Comb */}
        <group position={[-0.25, 4.95, 0]}>
          <mesh material={bronzeMat} scale={[0.82, 1.18, 1.0]}>
            <torusGeometry args={[0.88, 0.08, 14, 40]} />
          </mesh>
          <mesh material={glassMat} rotation={[Math.PI / 2, 0, 0]} scale={[0.76, 0.06, 1.12]}>
            <cylinderGeometry args={[0.88, 0.88, 1.0, 28]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, -1.25, 0]}>
            <cylinderGeometry args={[0.08, 0.18, 0.65, 14]} />
          </mesh>
        </group>

        <group position={[0.92, 4.85, 0.25]} rotation={[0, 0, -0.22]}>
          <mesh material={bronzeMat}>
            <boxGeometry args={[0.16, 1.45, 0.06]} />
          </mesh>
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} material={marbleMat} position={[-0.22, -0.58 + i * 0.145, 0]}>
              <boxGeometry args={[0.34, 0.05, 0.05]} />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
  if (kind === "nails") {
    return (
      <group position={[0, 3.72, 0]}>
        {/* Carved Travertine Presentation Tray */}
        <mesh material={travertineMat} position={[0, 0.1, 0]}>
          <boxGeometry args={[1.65, 0.2, 1.35]} />
        </mesh>
        {/* Faceted Manicure Polish Flacon & Tapered Bronze Cap */}
        <mesh material={glassMat} position={[-0.2, 0.68, 0]}>
          <cylinderGeometry args={[0.42, 0.48, 0.92, 8]} />
        </mesh>
        <mesh material={bronzeMat} position={[-0.2, 1.56, 0]}>
          <cylinderGeometry args={[0.15, 0.24, 0.88, 16]} />
        </mesh>
        {/* Angled Polish Brush & Pearl Cabochon */}
        <mesh material={bronzeMat} position={[0.45, 0.52, 0.18]} rotation={[0, 0, -0.78]}>
          <cylinderGeometry args={[0.05, 0.09, 0.95, 12]} />
        </mesh>
        <mesh material={marbleMat} position={[0.35, 0.34, -0.28]}>
          <sphereGeometry args={[0.24, 16, 12]} />
        </mesh>
      </group>
    );
  }
  if (kind === "cosmetology") {
    return (
      <group>
        {/* Classical Alabaster Essence Amphora */}
        <group position={[-0.2, 4.85, 0]}>
          <mesh material={bronzeMat} position={[0, -0.82, 0]}>
            <cylinderGeometry args={[0.36, 0.48, 0.26, 20]} />
          </mesh>
          <mesh material={marbleMat} position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.56, 0.32, 0.95, 22]} />
          </mesh>
          <mesh material={marbleMat} position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.58, 22, 16]} />
          </mesh>
          <mesh material={marbleMat} position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.2, 0.28, 0.65, 18]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.05, 10, 24]} />
          </mesh>
          {[-0.56, 0.56].map((hx, idx) => (
            <mesh key={idx} material={bronzeMat} position={[hx, 0.65, 0]}>
              <torusGeometry args={[0.28, 0.045, 10, 24]} />
            </mesh>
          ))}
        </group>

        {/* Angled Precision Serum Dropper Pipette */}
        <group position={[0.82, 5.1, 0.25]} rotation={[0, 0, 0.32]}>
          <mesh material={bronzeMat} position={[0, 0.68, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.48, 16]} />
          </mesh>
          <mesh material={marbleMat} position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
          </mesh>
          <mesh material={glassMat} position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.035, 1.0, 14]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, -0.82, 0]}>
            <sphereGeometry args={[0.09, 12, 10]} />
          </mesh>
        </group>
      </group>
    );
  }
  if (kind === "browsLashes") {
    return (
      <group position={[0, 4.9, 0]}>
        {/* Sculpted Classical Brow Arch & Golden-Ratio Ring */}
        <mesh material={bronzeMat} position={[0, 0.55, 0]}>
          <torusGeometry args={[0.92, 0.07, 12, 40, Math.PI]} />
        </mesh>
        <mesh material={marbleMat} position={[0, -0.05, -0.15]}>
          <torusGeometry args={[0.52, 0.04, 10, 32]} />
        </mesh>
        {/* Precision Slanted Bronze Tweezers */}
        <mesh material={bronzeMat} position={[-0.24, -0.15, 0.15]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.07, 1.45, 0.09]} />
        </mesh>
        <mesh material={bronzeMat} position={[0.24, -0.15, 0.15]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.07, 1.45, 0.09]} />
        </mesh>
        <mesh material={bronzeMat} position={[0, -0.88, 0.15]}>
          <cylinderGeometry args={[0.14, 0.22, 0.22, 16]} />
        </mesh>
      </group>
    );
  }
  // spa
  return (
    <group position={[0, 3.62, 0]}>
      {/* Two-Tiered Classical Fluted Marble Fountain Basin (Kylix) & Steam Rings */}
      <mesh material={marbleMat} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.28, 0.55, 1.1, 20]} />
      </mesh>
      <mesh material={marbleMat} position={[0, 1.18, 0]}>
        <cylinderGeometry args={[1.05, 0.42, 0.48, 28]} />
      </mesh>
      <mesh material={bronzeMat} position={[0, 1.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.06, 0.05, 10, 36]} />
      </mesh>
      <mesh material={marbleMat} position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.55, 18]} />
      </mesh>
      <mesh material={marbleMat} position={[0, 2.02, 0]}>
        <cylinderGeometry args={[0.58, 0.24, 0.28, 24]} />
      </mesh>
      <mesh material={bronzeMat} position={[0, 2.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.59, 0.035, 10, 32]} />
      </mesh>
      {/* Rising Warm Steam Rings */}
      <mesh material={glassMat} position={[0, 2.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.028, 8, 28]} />
      </mesh>
      <mesh material={glassMat} position={[0, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.022, 8, 24]} />
      </mesh>
    </group>
  );
}

/**
 * Dimension 2 — Sunlit Classical Renaissance Grooming Atelier:
 * Emerges after crossing the Looking-Glass Barber Mirror (z < -104).
 * Houses Ionic colonnades, 6 raycasted Grooming Art Plinths, the Vitruvian
 * Sundial Horologium around a sculpted Carrara Marble Barber Chair, and the
 * Maestro's Fluted-Marble Concierge Rostrum (z = -438).
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
  const emblemRefs = useRef<(THREE.Group | null)[]>([]);
  const clockRingRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const slabRefs = useRef<(THREE.Mesh | null)[]>([]);

  const {
    floorMat,
    carraraMat,
    travertineMat,
    bronzeMat,
    walnutMat,
    ivoryMat,
    glassMat,
    slabGeo,
    fluteAngles,
    slabSeeds,
    columnZ,
  } = useMemo(() => {
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        uFogCol: { value: ALABASTER_FOG },
        uFogDen: { value: ALABASTER_FOG_DENSITY },
      },
      vertexShader: VERT_WORLD,
      fragmentShader: /* glsl */ `
        ${FOG_FN}
        varying vec3 vP;
        varying float vZ;
        void main() {
          vec2 p = vP.xy;
          // Honed Roman travertine tiles with subtle stone mineral variation
          vec2 tile = floor(vec2(p.x * 0.25, p.y * 0.18));
          float checker = mod(tile.x + tile.y, 2.0);
          float groutX = smoothstep(0.03, 0.0, min(fract(p.x * 0.25), 1.0 - fract(p.x * 0.25)));
          float groutZ = smoothstep(0.03, 0.0, min(fract(p.y * 0.18), 1.0 - fract(p.y * 0.18)));
          float vein = sin(p.x * 0.9 + sin(p.y * 0.35) * 2.0) * 0.025;

          vec3 travA = vec3(0.91, 0.87, 0.80) + vein;
          vec3 travB = vec3(0.86, 0.81, 0.73) - vein;
          vec3 col = mix(travA, travB, checker);
          col *= 1.0 - (groutX + groutZ) * 0.12;

          // Antique-bronze colonnade inlays & Vitruvian sanctuary rings
          float aisle = smoothstep(0.09, 0.0, abs(abs(p.x) - 10.8)) * 0.55;
          float rClock = length(vec2(p.x, p.y + 296.0));
          float ringC = smoothstep(0.10, 0.0, abs(rClock - 7.4)) * 0.65
                      + smoothstep(0.08, 0.0, abs(rClock - 11.2)) * 0.40;
          float rDesk = length(vec2(p.x, p.y + 438.0));
          float ringD = smoothstep(0.10, 0.0, abs(rDesk - 8.5)) * 0.55;

          vec3 bronze = vec3(0.55, 0.43, 0.27);
          col = mix(col, bronze, clamp(aisle + ringC + ringD, 0.0, 0.75));

          // Soft sunlit colonnade shadows along the outer porticoes
          float porticoShade = smoothstep(11.0, 17.5, abs(p.x)) * 0.12;
          col *= 1.0 - porticoShade;

          gl_FragColor = vec4(applyFog(col, vZ), 1.0);
        }
      `,
    });

    const sGeo = shade(new THREE.BoxGeometry(1.45, 0.32, 0.16));
    const fAngles = Array.from({ length: 20 }, (_, i) => (i - 9.5) * 0.34);
    const colsZ = [-118, -156, -195, -234, -272, -334, -372, -412];

    const seeds = Array.from({ length: SLAB_COUNT }, (_, i) => {
      const s1 = ((i * 137.5 + 17) % 100) / 100;
      const s2 = ((i * 293.1 + 53) % 100) / 100;
      const s3 = ((i * 419.7 + 89) % 100) / 100;
      return {
        sx: (s1 - 0.5) * 20,
        sy: (s2 - 0.3) * 11,
        sz: (s3 - 0.5) * 26,
        rx: (s1 - 0.5) * 1.6,
        ry: (s2 - 0.5) * 2.2,
      };
    });

    return {
      floorMat: fMat,
      carraraMat: makeClassicalStoneMat(C.CARRARA, 0.07),
      travertineMat: makeClassicalStoneMat(C.TRAVERTINE, 0.09),
      bronzeMat: makeClassicalStoneMat(C.BRONZE, 0.03),
      walnutMat: makeClassicalStoneMat(C.WOOD, 0.05),
      ivoryMat: makeClassicalStoneMat(0xfbf8f1, 0.03),
      glassMat: makeClassicalStoneMat(0xdbe3ea, 0.02),
      slabGeo: sGeo,
      fluteAngles: fAngles,
      slabSeeds: seeds,
      columnZ: colsZ,
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current?.smooth ?? 0;

    // Gentle sculptural sway & float keeping busts/tools facing forward toward visitors
    emblemRefs.current.forEach((grp, idx) => {
      if (!grp) return;
      const spec = PLINTHS[idx];
      const isSelected = world.current?.selectedCategory === spec.key;
      const targetY = Math.sin(t * 1.1 + idx * 0.9) * 0.10 + (isSelected ? 0.35 : 0);
      grp.position.y += (targetY - grp.position.y) * 0.08;
      grp.rotation.y = Math.sin(t * 0.75 + idx * 0.9) * 0.28;
      const s = isSelected ? 1.09 : 1.0;
      grp.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    });

    // Vitruvian Sundial Horologium & 16 snapping ivory appointment slabs (0.56 -> 0.74)
    const snap = smoothstep(0.56, 0.74, p);
    if (clockRingRef.current) {
      clockRingRef.current.rotation.z = t * 0.05;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 0.30 - p * 10.0;
    }

    slabRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const seed = slabSeeds[i];
      const angle = (i / SLAB_COUNT) * Math.PI * 2;
      const ringR = 4.35;
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
      {/* Sunlit Honed Roman Travertine Piazza Floor */}
      <mesh
        material={floorMat}
        position={[0, FLOOR_Y, -295]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[260, 410]} />
      </mesh>

      {/* Fluted Ionic Marble Colonnades & Architrave Beams */}
      {columnZ.map((z) =>
        [-14.8, 14.8].map((x) => (
          <group key={`${z}_${x}`} position={[x, FLOOR_Y, z]}>
            {/* Stepped Plinth Base */}
            <mesh material={travertineMat} position={[0, 0.45, 0]}>
              <boxGeometry args={[2.2, 0.9, 2.2]} />
            </mesh>
            {/* Fluted Carrara Shaft */}
            <mesh material={carraraMat} position={[0, 10.5, 0]}>
              <cylinderGeometry args={[0.72, 0.86, 19.2, 16]} />
            </mesh>
            {/* Ionic Capital & Bronze Astragal */}
            <mesh material={bronzeMat} position={[0, 19.9, 0]}>
              <cylinderGeometry args={[0.92, 0.78, 0.25, 16]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 20.55, 0]}>
              <boxGeometry args={[2.3, 1.0, 2.3]} />
            </mesh>
          </group>
        ))
      )}

      {/* Longitudinal Entablature Beams */}
      {[-14.8, 14.8].map((x) => (
        <mesh key={`beam_${x}`} material={carraraMat} position={[x, FLOOR_Y + 21.8, -270]}>
          <boxGeometry args={[2.1, 1.6, 330]} />
        </mesh>
      ))}

      {/* 4 Coffered Renaissance Triumphal Arches */}
      {[-118, -195, -272, -372].map((z) => (
        <group key={`arch_${z}`} position={[0, FLOOR_Y, z]}>
          <mesh material={travertineMat} position={[0, 21.6, 0]}>
            <boxGeometry args={[32.0, 1.8, 2.2]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 20.6, 0]}>
            <boxGeometry args={[28.4, 0.14, 2.26]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 22.8, 0]}>
            <boxGeometry args={[33.2, 0.7, 2.6]} />
          </mesh>
        </group>
      ))}

      {/* Act III — Colonnade of the Six Grooming Arts */}
      {PLINTHS.map((m, idx) => (
        <group
          key={m.key}
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
          {/* Stepped Marble Plinth */}
          <mesh material={travertineMat} position={[0, 0.35, 0]}>
            <boxGeometry args={[2.5, 0.7, 2.5]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 2.1, 0]}>
            <boxGeometry args={[1.95, 2.8, 1.95]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 3.55, 0]}>
            <boxGeometry args={[2.1, 0.12, 2.1]} />
          </mesh>

          {/* Animated Sculpted Grooming Emblem */}
          <group
            ref={(el) => {
              emblemRefs.current[idx] = el;
            }}
          >
            <GroomingEmblem
              kind={m.key}
              marbleMat={carraraMat}
              bronzeMat={bronzeMat}
              travertineMat={travertineMat}
              glassMat={glassMat}
            />
          </group>
        </group>
      ))}

      {/* Act IV — Vitruvian Sundial Horologium & Sculpted Marble Barber Chair */}
      <group position={[0, FLOOR_Y, -296]}>
        {/* Stepped Circular Travertine Dais */}
        <mesh material={travertineMat} position={[0, 0.22, 0]}>
          <cylinderGeometry args={[6.4, 6.8, 0.44, 48]} />
        </mesh>
        <mesh material={carraraMat} position={[0, 0.56, 0]}>
          <cylinderGeometry args={[4.8, 5.1, 0.24, 48]} />
        </mesh>

        {/* Center-Stage Sculpted Carrara Marble & Bronze Barber Chair */}
        <group position={[0, 0.68, 0]} scale={0.78}>
          <mesh material={bronzeMat} position={[0, 0.3, 0]}>
            <cylinderGeometry args={[1.9, 1.2, 0.6, 24]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 1.8, 18]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 2.75, 0]}>
            <boxGeometry args={[3.0, 0.85, 3.0]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 4.55, -1.2]} rotation={[-0.14, 0, 0]}>
            <boxGeometry args={[3.0, 3.4, 0.8]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 6.45, -1.55]} rotation={[-0.14, 0, 0]}>
            <boxGeometry args={[1.6, 0.95, 0.65]} />
          </mesh>
          <mesh material={bronzeMat} position={[-1.6, 3.55, 0]}>
            <boxGeometry args={[0.45, 0.32, 2.8]} />
          </mesh>
          <mesh material={bronzeMat} position={[1.6, 3.55, 0]}>
            <boxGeometry args={[0.45, 0.32, 2.8]} />
          </mesh>
        </group>

        {/* Surrounding Bronze Armillary Sundial Ring & 16 Ivory Appointment Slabs */}
        <group position={[0, 6.8, 0]}>
          <group ref={clockRingRef}>
            <mesh material={bronzeMat}>
              <torusGeometry args={[5.2, 0.09, 12, 64]} />
            </mesh>
            <mesh material={carraraMat}>
              <torusGeometry args={[5.7, 0.14, 12, 64]} />
            </mesh>
          </group>
          <mesh ref={minuteHandRef} material={bronzeMat} position={[0, 0, 0.1]}>
            <boxGeometry args={[0.11, 3.6, 0.08]} />
          </mesh>

          {slabSeeds.map((_, i) => (
            <mesh
              key={i}
              ref={(el) => {
                slabRefs.current[i] = el;
              }}
              geometry={slabGeo}
              material={i % 4 === 0 ? bronzeMat : ivoryMat}
            />
          ))}
        </group>

        {/* SmartChair Walk-In QR Obelisk connecting live queue to scheduled slots */}
        <group position={[-6.8, 0, 2.8]} rotation={[0, 0.35, 0]}>
          <mesh material={travertineMat} position={[0, 0.25, 0]}>
            <boxGeometry args={[1.6, 0.5, 1.1]} />
          </mesh>
          <mesh material={carraraMat} position={[0, 2.3, 0]}>
            <boxGeometry args={[1.15, 3.6, 0.28]} />
          </mesh>
          <mesh material={bronzeMat} position={[0, 4.16, 0]}>
            <boxGeometry args={[1.24, 0.12, 0.34]} />
          </mesh>
          {/* 3x3 Antique-Bronze QR Finder Relief Matrix */}
          {[-0.28, 0, 0.28].map((qx, xi) =>
            [-0.28, 0, 0.28].map((qy, yi) => {
              if ((xi + yi) % 2 === 1 && !(xi === 0 && yi === 2)) return null;
              return (
                <mesh
                  key={`${xi}_${yi}`}
                  material={bronzeMat}
                  position={[qx, 3.05 + qy, 0.16]}
                >
                  <boxGeometry args={[0.18, 0.18, 0.05]} />
                </mesh>
              );
            })
          )}
        </group>
      </group>

      {/* Act V — The Maestro's Fluted-Marble & Walnut Concierge Rostrum (z = -438) */}
      <group position={[0, FLOOR_Y, -438]}>
        {/* Travertine Step */}
        <mesh material={travertineMat} position={[0, 0.18, 0]}>
          <boxGeometry args={[9.4, 0.36, 3.6]} />
        </mesh>
        {/* Main Walnut & Carrara Body */}
        <mesh material={walnutMat} position={[0, 1.65, 0]}>
          <boxGeometry args={[7.4, 2.6, 2.1]} />
        </mesh>
        {/* 20 Vertical Carrara Marble Flutes */}
        {fluteAngles.map((fx, i) => (
          <mesh key={i} material={carraraMat} position={[fx, 1.65, 1.08]}>
            <boxGeometry args={[0.12, 2.35, 0.10]} />
          </mesh>
        ))}
        {/* Cantilevered Carrara Marble Top Slab with Bronze Astragal */}
        <mesh material={carraraMat} position={[0, 3.12, 0]}>
          <boxGeometry args={[8.0, 0.24, 2.5]} />
        </mesh>
        <mesh material={bronzeMat} position={[0, 2.98, 1.15]}>
          <boxGeometry args={[7.8, 0.08, 0.12]} />
        </mesh>
        {/* Angled Bronze & Marble Appointment Ledger Lectern */}
        <group position={[0, 3.32, 0.2]} rotation={[0.28, 0, 0]}>
          <mesh material={bronzeMat}>
            <boxGeometry args={[1.65, 0.08, 1.05]} />
          </mesh>
          <mesh material={ivoryMat} position={[0, 0.07, 0]}>
            <boxGeometry args={[1.45, 0.06, 0.88]} />
          </mesh>
        </group>

        {/* Twin Monumental Guardian Classical Male Busts Flanking the Rostrum */}
        {[
          { x: -6.4, ry: 0.32 },
          { x: 6.4, ry: -0.32 },
        ].map((g) => (
          <group key={g.x} position={[g.x, 0, -1.2]} rotation={[0, g.ry, 0]}>
            <mesh material={travertineMat} position={[0, 0.3, 0]}>
              <boxGeometry args={[2.3, 0.6, 2.3]} />
            </mesh>
            <mesh material={carraraMat} position={[0, 1.55, 0]}>
              <boxGeometry args={[1.75, 1.9, 1.75]} />
            </mesh>
            <mesh material={bronzeMat} position={[0, 2.55, 0]}>
              <boxGeometry args={[1.9, 0.12, 1.9]} />
            </mesh>
            <ClassicalMaleBust position={[0, 2.61, 0]} height={2.85} />
          </group>
        ))}

        {/* Sunlit Renaissance Triumphal Back Arch */}
        <mesh material={carraraMat} position={[0, 7.6, -5.8]}>
          <torusGeometry args={[6.4, 0.32, 14, 64, Math.PI]} />
        </mesh>
        <mesh material={bronzeMat} position={[0, 7.6, -5.5]}>
          <torusGeometry args={[5.9, 0.07, 10, 64, Math.PI]} />
        </mesh>
      </group>
    </group>
  );
}
