import { C, FLOOR_Y, ZONES } from "./constants";

export type Box = { c: number; p: [number, number, number]; s: [number, number, number]; ry: number; rx: number };
export type Cyl = { c: number; p: [number, number, number]; r: number; h: number; ry: number; rx: number };
export type Practical = { p: [number, number, number]; w: number; h: number; ry: number; color: number; sw: number; sh: number };
export type Mirror = { p: [number, number, number]; s: [number, number]; ry: number };

export type SalonChairPlacement = { p: [number, number, number]; yaw: number };

export interface Shop {
  boxes: Box[];
  cyls: Cyl[];
  taps: Cyl[];
  chairs: SalonChairPlacement[];
  practicals: Practical[];
  mirrors: Mirror[];
  fanAt: [number, number, number];
  poleAt: [number, number, number];
}

export function buildShop(): Shop {
  const boxes: Box[] = [], cyls: Cyl[] = [], taps: Cyl[] = [];
  const chairs: SalonChairPlacement[] = [];
  const practicals: Practical[] = [], mirrors: Mirror[] = [];

  const box = (c: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0, rx = 0) =>
    boxes.push({ c, p: [x, y, z], s: [sx, sy, sz], ry, rx });
  const cyl = (c: number, x: number, y: number, z: number, r: number, h: number, ry = 0, rx = 0) =>
    cyls.push({ c, p: [x, y, z], r, h, ry, rx });
  const tap = (c: number, x: number, y: number, z: number, r: number, h: number, ry = 0, rx = 0) =>
    taps.push({ c, p: [x, y, z], r, h, ry, rx });
  const light = (x: number, y: number, z: number, w: number, h: number, ry: number, color: number, sw: number, sh: number) =>
    practicals.push({ p: [x, y, z], w, h, ry, color, sw, sh });
  const mirror = (x: number, y: number, z: number, w: number, h: number, ry = 0) =>
    mirrors.push({ p: [x, y, z], s: [w, h], ry });

  /* ---- Sculpted BarberShopChair_01 instances for the Hair-Cutting Floor ---- */
  const chair = (x: number, z: number, yaw: number) => {
    chairs.push({ p: [x, FLOOR_Y, z], yaw });
  };

  const station = (z: number, wallX: number, side: number) => {
    mirror(wallX + side * 0.22, 1.0, z, 4.2, 5.4, (side * Math.PI) / 2);
    box(C.WOOD, wallX + side * 1.05, -2.7, z, 2.1, 0.28, 5.2);
    box(C.WOOD2, wallX + side * 0.25, -4.4, z, 0.4, 3.2, 5.0);
    for (let k = 0; k < 4; k++) {
      cyl(C.GLASS, wallX + side * (1.05 + (k % 2) * 0.45), -2.1, z - 1.6 + k * 1.05, 0.16, 0.85 + (k % 3) * 0.3);
    }
    light(wallX + side * 0.5, 4.4, z, 0.5, 4.4, (side * Math.PI) / 2, 0xffd098, 9, 12);
  };

  /* ---- World 1 Threshold Portal Frame (z = -30) ---- */
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
    cyl(C.WOOD2, -fw, (FLOOR_Y + fh) / 2, z1, 0.28, fh - FLOOR_Y);
    cyl(C.WOOD2, fw, (FLOOR_Y + fh) / 2, z1, 0.28, fh - FLOOR_Y);
    cyl(C.CHROME, -fw, fh - 0.2, z1, 0.36, 0.22);
    cyl(C.CHROME, fw, fh - 0.2, z1, 0.36, 0.22);
    box(C.WOOD2, 0, fh, z1, fw * 2 + 0.5, 0.45, 0.65);
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

  /* ================= 02 HAIR-CUTTING SALON FLOOR (z: -30 -> -98) ================= */
  // Left & Right wall barber stations with illuminated arched mirrors, curved walnut counters & sculpted chairs
  [-46, -66, -84].forEach((z, i) => {
    station(z, -12.5, 1);
    chair(-8.4, z, -Math.PI / 2 + (i % 2 ? 0.14 : -0.10));

    station(z, 12.5, -1);
    chair(8.4, z, Math.PI / 2 + (i % 2 ? -0.12 : 0.14));
  });

  // Warm overhead salon pendant pools along the cutting aisle
  [-44, -64, -84].forEach((z) => {
    light(0, 7.6, z, 1.8, 1.8, 0, 0xffe0a3, 18, 18);
  });

  // Fluted Walnut Columns framing the Grand Arched Mirror Pediment (z = -97.0)
  cyl(C.WOOD, -4.3, -0.6, -97.1, 0.42, 12.8);
  cyl(C.WOOD, 4.3, -0.6, -97.1, 0.42, 12.8);
  cyl(C.CHROME, -4.3, 5.4, -97.1, 0.54, 0.3);
  cyl(C.CHROME, 4.3, 5.4, -97.1, 0.54, 0.3);
  box(C.WOOD, 0, -5.8, -97.0, 9.4, 2.2, 1.1);
  light(0, 4.4, -96.4, 6.8, 0.32, 0, 0xffe4b5, 14, 12);

  void tap;

  return {
    boxes, cyls, taps, chairs, practicals, mirrors,
    fanAt: [0, 9.6, -74],
    poleAt: [-4.4, -1.0, -448],
  };
}
