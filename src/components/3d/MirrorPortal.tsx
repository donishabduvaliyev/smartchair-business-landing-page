import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

// Pre-generate deterministic pseudo-random particle positions statically
const DUST_COUNT = 90;
const DUST_POSITIONS = new Float32Array(DUST_COUNT * 3);
for (let i = 0; i < DUST_COUNT; i++) {
  const s1 = ((i * 137.5 + 43) % 1000) / 1000;
  const s2 = ((i * 293.1 + 89) % 1000) / 1000;
  const s3 = ((i * 419.7 + 131) % 1000) / 1000;
  DUST_POSITIONS[i * 3] = (s1 - 0.5) * 8;
  DUST_POSITIONS[i * 3 + 1] = (s2 - 0.5) * 6;
  DUST_POSITIONS[i * 3 + 2] = (s3 - 0.5) * 5 + 0.5;
}

// Floating Ambient Dust Particles in the Room
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.15;
    pointsRef.current.rotation.y = t * 0.2;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[DUST_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d4af5a"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export function MirrorPortal({
  scrollProgress = 0,
}: {
  scrollProgress?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();

  // Smooth mouse tilt & spring physics
  const rotX = useRef(0);
  const rotY = useRef(0);

  // Catmull-Rom dolly curve tracking scroll progress
  useFrame((_, delta) => {
    // 1. Mouse Parallax (±14 degrees)
    const targetRotX = pointer.y * 0.14;
    const targetRotY = pointer.x * 0.18;
    rotX.current += (targetRotX - rotX.current) * Math.min(delta * 6, 1);
    rotY.current += (targetRotY - rotY.current) * Math.min(delta * 6, 1);

    if (groupRef.current) {
      groupRef.current.rotation.x = rotX.current;
      groupRef.current.rotation.y = rotY.current;
    }

    // 2. Camera Dolly-Through Rig
    // At scroll 0.0 -> z = 5.2
    // At scroll 0.6 -> z = 2.4 (zooming close into mirror glass)
    // At scroll 1.0 -> z = -0.5 (pushing through the portal)
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    const targetZ = 5.2 - p * 5.7;
    camera.position.z += (targetZ - camera.position.z) * Math.min(delta * 8, 1);

    // Subtle breathing wobble
    const t = performance.now() * 0.001;
    camera.position.x = Math.sin(t * 0.8) * 0.04;
    camera.position.y = Math.cos(t * 0.6) * 0.03;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Warm Champagne Backlight Halo */}
      <pointLight position={[0, 0, -0.6]} intensity={4.5} color="#d4af5a" distance={8} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#d4af5a" />

      <AmbientDust />

      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Warm Backlight Halo Quad */}
        <mesh position={[0, 0, -0.15]}>
          <planeGeometry args={[4.4, 5.8]} />
          <meshBasicMaterial
            color="#d4af5a"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Monumental Obsidian Beveled Frame */}
        {/* Outer Frame Mesh */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.8, 5.2, 0.22]} />
          <meshPhysicalMaterial
            color="#0d0e12"
            roughness={0.45}
            metalness={0.7}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Inner Gold Inset Bevel Rail */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[3.48, 4.88, 0.06]} />
          <meshPhysicalMaterial
            color="#d4af5a"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>

        {/* Real-time Obsidian Mirror Glass Surface */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[3.36, 4.76]} />
          <meshPhysicalMaterial
            color="#08090b"
            roughness={0.08}
            metalness={0.95}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            reflectivity={0.9}
            transparent
            opacity={0.94}
          />
        </mesh>

        {/* Specular Top Rim Highlight Line */}
        <mesh position={[0, 2.37, 0.07]}>
          <planeGeometry args={[3.34, 0.015]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>

        {/* Laser Grid Coordinate Lines on Mirror Glass */}
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[3.2, 4.6]} />
          <meshBasicMaterial
            color="#d4af5a"
            transparent
            opacity={0.04}
            wireframe
          />
        </mesh>
      </group>
    </>
  );
}
