import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import { FLOOR_Y } from "./constants";
import type { ScrollState } from "../lib/useScroll";

interface InscriptionSpec {
  id: string;
  eyebrow: string;
  title: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
}

function makeSurfaceInscription(eyebrow: string, title: string, anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";

    // Thin brass architectural rule
    ctx.fillStyle = "rgba(212, 175, 90, 0.55)";
    ctx.fillRect(724, 110, 600, 2);

    ctx.font = '500 32px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(212, 175, 90, 0.85)";
    ctx.fillText(eyebrow.toUpperCase(), 1024, 165);

    ctx.font = 'italic 400 124px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = "rgba(242, 239, 233, 0.82)";
    ctx.fillText(title, 1024, 325);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = Math.min(8, anisotropy);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function SurfacePlate({
  spec,
  anisotropy,
}: {
  spec: InscriptionSpec;
  anisotropy: number;
}) {
  const tex = useMemo(
    () => makeSurfaceInscription(spec.eyebrow, spec.title, anisotropy),
    [spec.eyebrow, spec.title, anisotropy]
  );

  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <mesh position={spec.position} rotation={spec.rotation}>
      <planeGeometry args={spec.scale} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        fog
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Diegetic 3D surface inscriptions etched directly onto the salon floor
 * and horizon runway — zero floating quads colliding with lamps.
 */
export function SpatialTypography(_props: {
  scroll: React.RefObject<ScrollState>;
}) {
  const { gl } = useThree();
  const { i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const maxAniso = gl.capabilities.getMaxAnisotropy();

  const specs = useMemo<InscriptionSpec[]>(() => {
    const labels =
      lang === "uz"
        ? {
            floor1: ["SMARTCHAIR // UZBEKISTAN", "Kreslodan Boshlang"],
            floor2: ["DUNYO 02 // METAMORFOZ", "Yagona Raqamli Ufq"],
          }
        : lang === "ru"
          ? {
              floor1: ["SMARTCHAIR // UZBEKISTAN", "Начните с Кресла"],
              floor2: ["МИР 02 // МЕТАМОРФОЗА", "Единый Цифровой Горизонт"],
            }
          : {
              floor1: ["SMARTCHAIR // UZBEKISTAN", "Enter The Chair"],
              floor2: ["WORLD 02 // METAMORPHOSIS", "One Connected Horizon"],
            };

    return [
      {
        id: "floor-threshold",
        eyebrow: labels.floor1[0],
        title: labels.floor1[1],
        position: [0, FLOOR_Y + 0.04, -36],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [12, 3.0],
      },
      {
        id: "floor-horizon",
        eyebrow: labels.floor2[0],
        title: labels.floor2[1],
        position: [0, FLOOR_Y + 0.04, -126],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [18, 4.5],
      },
    ];
  }, [lang]);

  return (
    <group>
      {specs.map((spec) => (
        <SurfacePlate key={spec.id} spec={spec} anisotropy={maxAniso} />
      ))}
    </group>
  );
}
