import { C, FLOOR_Y, ZONES } from "./constants";

export type Box = { c: number; p: [number, number, number]; s: [number, number, number]; ry: number; rx: number };
export type Cyl = { c: number; p: [number, number, number]; r: number; h: number; ry: number; rx: number };
export type Practical = { p: [number, number, number]; w: number; h: number; ry: number; color: number; sw: number; sh: number };
export type Mirror = { p: [number, number, number]; s: [number, number]; ry: number };

export interface Shop {
  boxes: Box[];
  cyls: Cyl[];
  taps: Cyl[];
  practicals: Practical[];
  mirrors: Mirror[];
  fanAt: [number, number, number];
  poleAt: [number, number, number];
}

export function buildShop(): Shop {
  const boxes: Box[] = [], cyls: Cyl[] = [], taps: Cyl[] = [];
  const practicals: Practical[] = [], mirrors: Mirror[] = [];

  const box = (c: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0, rx = 0) =>
    boxes.push({ c, p: [x, y, z], s: [sx, sy, sz], ry, rx });
  const cyl = (c: number, x: number, y: number, z: number, r: number, h: number, ry = 0, rx = 0) =>
    cyls.push({ c, p: [x, y, z], r, h, ry, rx });
  const tap = (c: number, x: number, y: number, z: number, r: number, h: number, ry = 0, rx = 0) =>
    taps.push({ c, p: [x, y, z], r, h, ry, rx });
  const light = (x: number, y: number, z: number, w: number, h: number, ry: number, color: number, sw: number, sh: number) =>
    practicals.push({ p: [x, y, z], w, h, ry, color, sw, sh });

  /* ---- World 1 Threshold Portal Frame (z = -32) ---- */
  {
    const [, , z1, hw, cy] = ZONES[0];
    const [, , , nhw, ncy] = ZONES[1];
    const minW = Math.min(hw, nhw), maxW = Math.max(hw, nhw);
    const minC = Math.min(cy, ncy), maxC = Math.max(cy, ncy);
    if (maxW - minW > 0.01) {
      [-1, 1].forEach((s) =>
        box(C.BLOCK, (s * (minW + maxW)) / 2, (FLOOR_Y + maxC) / 2, z1, maxW - minW, maxC - FLOOR_Y, 0.6)
      );
    }
    if (maxC - minC > 0.01) box(C.BLOCK, 0, (minC + maxC) / 2, z1, minW * 2, maxC - minC, 0.6);
    const fw = minW - 0.35, fh = minC - 0.5;
    box(C.WOOD2, -fw, (FLOOR_Y + fh) / 2, z1, 0.5, fh - FLOOR_Y, 0.7);
    box(C.WOOD2, fw, (FLOOR_Y + fh) / 2, z1, 0.5, fh - FLOOR_Y, 0.7);
    box(C.WOOD2, 0, fh, z1, fw * 2 + 0.5, 0.5, 0.7);
  }

  /* ================= 01 RECEPTION — warm walnut & SmartChair terminal ================= */
  box(C.WOOD, -4.2, -4.6, -14, 5.0, 2.4, 3.2, 0.12);
  box(C.WOOD, -4.2, -3.3, -14, 5.4, 0.3, 3.6, 0.12);
  box(C.CLOTH, -4.4, -3.05, -14.4, 1.5, 0.14, 1.1, 0.3);
  box(C.DARK, -3.2, -2.55, -13.6, 1.6, 1.0, 0.12, -0.25, -0.2);
  light(-3.2, -2.55, -13.52, 1.35, 0.8, -0.25, 0xd4af5a, 4, 4);
  cyl(C.CHROME, -2.6, -2.6, -15.6, 0.1, 1.4);
  light(-2.6, -1.8, -15.6, 1.0, 1.0, 0, 0xffe0a3, 9, 9);
  cyl(C.GLASS, -6.6, -5.2, -19.5, 0.9, 3.4);
  for (let i = 0; i < 5; i++) cyl(C.CHROME, 6.2, 1.2, -8 - i * 2.6, 0.1, 0.7, 0, Math.PI / 2);
  light(0, 3.2, -22, 1.6, 1.6, 0, 0xffe4b5, 16, 14);
  box(C.WOOD, 6.4, 0.6, -26, 0.4, 3.0, 1.6);

  /* ================= 02 WAITING & PORTAL THRESHOLD ================= */
  for (let i = 0; i < 3; i++) {
    const z = -46 - i * 18;
    box(C.WOOD, 7.6, -5.1, z, 2.2, 0.4, 9);
    box(C.WOOD, 8.7, -3.9, z, 0.4, 2.4, 9);
    cyl(C.WOOD, 7.6, -6.2, z - 3.6, 0.16, 1.6);
    cyl(C.WOOD, 7.6, -6.2, z + 3.6, 0.16, 1.6);
  }
  box(C.WOOD, 5.0, -5.6, -70, 2.0, 0.25, 3.0);
  box(C.CLOTH, 5.0, -5.4, -70, 1.1, 0.06, 1.5, 0.4);
  box(C.CLOTH, 5.0, -5.3, -70.6, 1.0, 0.06, 1.4, -0.2);
  cyl(C.WOOD2, -8.6, 2.6, -60, 1.5, 0.24, 0, Math.PI / 2);
  light(8.9, 0.6, -52, 0.4, 8.0, -Math.PI / 2, 0x9fd0dc, 22, 20);
  light(8.9, 0.6, -86, 0.4, 8.0, -Math.PI / 2, 0x9fd0dc, 22, 20);
  light(0, 5.2, -66, 1.4, 1.4, 0, 0xffb066, 15, 15);
  for (let f = 0; f < 5; f++) box(C.WOOD2, -8.85, 1.4 + (f % 3) * 0.7, -40 - f * 13, 0.16, 1.9, 1.4);

  void tap;

  return {
    boxes, cyls, taps, practicals, mirrors,
    fanAt: [0, 9.6, -74],
    poleAt: [-4.4, -1.0, -448],
  };
}
