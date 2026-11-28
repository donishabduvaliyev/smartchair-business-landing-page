import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import type { ScrollState } from "../lib/useScroll";

interface TypePlaneSpec {
  id: string;
  eyebrow: string;
  line1: string;
  accent: string;
  line2: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number];
  range: [number, number];
}

function renderTypographyTexture(
  eyebrow: string,
  line1: string,
  accent: string,
  line2: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Eyebrow with subtle champagne rule
    ctx.fillStyle = "#d4af5a";
    ctx.fillRect(40, 64, 48, 2);
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(212, 175, 90, 0.92)";
    ctx.fillText(eyebrow.toUpperCase(), 106, 72);

    // Line 1
    ctx.font = '500 92px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#f2efe9";
    ctx.shadowColor = "rgba(5, 7, 10, 0.85)";
    ctx.shadowBlur = 24;
    ctx.fillText(line1, 40, 195);

    // Line 2: Editorial Italic Accent + Roman continuation
    ctx.font = 'italic 400 108px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = "#d4af5a";
    ctx.fillText(accent, 40, 325);
    const accentW = ctx.measureText(accent + " ").width;

    ctx.font = '500 88px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = "#f2efe9";
    ctx.fillText(line2, 40 + accentW, 325);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function TypePlane({
  spec,
  scroll,
}: {
  spec: TypePlaneSpec;
  scroll: React.RefObject<ScrollState>;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useMemo(
    () => renderTypographyTexture(spec.eyebrow, spec.line1, spec.accent, spec.line2),
    [spec.eyebrow, spec.line1, spec.accent, spec.line2]
  );

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame(() => {
    if (!matRef.current) return;
    const p = scroll.current?.smooth ?? 0;
    const [a, b] = spec.range;
    const inV = a <= 0 ? 1 : Math.min(1, Math.max(0, (p - a) / 0.04));
    const outV = Math.min(1, Math.max(0, (b - p) / 0.04));
    matRef.current.opacity = Math.min(inV, outV);
  });

  return (
    <mesh position={spec.position} rotation={spec.rotation ?? [0, 0, 0]}>
      <planeGeometry args={spec.scale} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        depthWrite={false}
        fog
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function SpatialTypography({
  scroll,
}: {
  scroll: React.RefObject<ScrollState>;
}) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const specs = useMemo<TypePlaneSpec[]>(() => {
    if (lang === "uz") {
      return [
        {
          id: "act1",
          eyebrow: "01 · Kirish · SmartChair",
          line1: "Har bir kreslo,",
          accent: "jonli",
          line2: "tizimga ulangan.",
          position: [1.6, 1.4, -18],
          scale: [12.5, 5.0],
          range: [0, 0.12],
        },
        {
          id: "act2",
          eyebrow: "02 · Metamorfoz",
          line1: "Jismoniy hunardan",
          accent: "raqamli",
          line2: "uyg'unlikka.",
          position: [2.8, 2.2, -62],
          rotation: [0, -0.22, 0],
          scale: [13.5, 5.4],
          range: [0.08, 0.24],
        },
        {
          id: "act3",
          eyebrow: "03 · Mijozlar uchun",
          line1: "Toping, tanlang,",
          accent: "bir zumda",
          line2: "bron qiling.",
          position: [-12.6, 5.8, -142],
          rotation: [0, Math.PI / 2, 0],
          scale: [14.0, 5.6],
          range: [0.22, 0.48],
        },
      ];
    }

    if (lang === "ru") {
      return [
        {
          id: "act1",
          eyebrow: "01 · Вход · SmartChair",
          line1: "Каждое кресло",
          accent: "в живом",
          line2: "ритме.",
          position: [1.6, 1.4, -18],
          scale: [12.5, 5.0],
          range: [0, 0.12],
        },
        {
          id: "act2",
          eyebrow: "02 · Метаморфоза",
          line1: "От ремесла к",
          accent: "единой",
          line2: "платформе.",
          position: [2.8, 2.2, -62],
          rotation: [0, -0.22, 0],
          scale: [13.5, 5.4],
          range: [0.08, 0.24],
        },
        {
          id: "act3",
          eyebrow: "03 · Для клиентов",
          line1: "Найти место и",
          accent: "мгновенно",
          line2: "записаться.",
          position: [-12.6, 5.8, -142],
          rotation: [0, Math.PI / 2, 0],
          scale: [14.0, 5.6],
          range: [0.22, 0.48],
        },
      ];
    }

    return [
      {
        id: "act1",
        eyebrow: "01 · The Threshold · SmartChair",
        line1: "Every chair,",
        accent: "connected",
        line2: "in real time.",
        position: [1.6, 1.4, -18],
        scale: [12.5, 5.0],
        range: [0, 0.12],
      },
      {
        id: "act2",
        eyebrow: "02 · Metamorphosis",
        line1: "From physical craft",
        accent: "into one",
        line2: "living world.",
        position: [2.8, 2.2, -62],
        rotation: [0, -0.22, 0],
        scale: [13.5, 5.4],
        range: [0.08, 0.24],
      },
      {
        id: "act3",
        eyebrow: "03 · Customer Discovery",
        line1: "Discover, choose,",
        accent: "book",
        line2: "inside Telegram.",
        position: [-12.6, 5.8, -142],
        rotation: [0, Math.PI / 2, 0],
        scale: [14.0, 5.6],
        range: [0.22, 0.48],
      },
    ];
  }, [lang]);

  return (
    <group>
      {specs.map((spec) => (
        <TypePlane key={spec.id} spec={spec} scroll={scroll} />
      ))}
    </group>
  );
}
