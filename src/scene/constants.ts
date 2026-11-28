import * as THREE from "three";

export const FLOOR_Y = -7;
export const END_Z = -466;

export const FOG_COLOR = new THREE.Color(0x0b0c10);
export const FOG_DENSITY = 0.006;
export const SODIUM = new THREE.Color(0xd4af5a);

/** name, zStart, zEnd, halfWidth, ceilingY, floorKind, wallKind */
export type Zone = [string, number, number, number, number, number, number];

export const ZONES: Zone[] = [
  ["reception", 14, -32, 7.0, 4.0, 0, 0],
  ["waiting", -32, -102, 9.0, 6.0, 0, 0],
  ["floor", -102, -178, 14.0, 11.0, 1, 1],
  ["capacity", -178, -252, 14.0, 11.0, 1, 1],
  ["wash", -252, -322, 8.0, 5.0, 2, 2],
  ["station", -322, -378, 6.0, 4.0, 1, 0],
  ["back", -378, -422, 6.0, 3.0, 3, 3],
  ["exit", -422, -466, 6.0, 6.0, 3, 3],
];

/**
 * Where each room starts and ends as a fraction of the scroll, assuming
 * the camera moves at a constant pace. Use this to keep the titles in
 * src/content/scenes.ts landing exactly on the thresholds if you resize
 * a room: console.log(zoneBounds()).
 */
export function zoneBounds() {
  const z0 = ZONES[0][1];
  const z1 = -458;
  const total = z0 - z1;
  return ZONES.map((Z) => ({
    name: Z[0],
    a: +((z0 - Z[1]) / total).toFixed(3),
    b: +((z0 - Z[2]) / total).toFixed(3),
  }));
}

/** Materials palette, as plain ints so they can key the instance batches. */
export const C = {
  DARK: 0x16181f,    // Satin obsidian frame
  HIDE: 0x4a2f21,    // Rich cognac Italian leather chairs
  CHROME: 0xd4af5a,  // Brushed Champagne Brass chair bases & hardware
  WOOD: 0x38261a,    // Warm American walnut counters & benches
  WOOD2: 0x7a5c32,   // Champagne-oak architectural portal frames
  GLASS: 0x4b5563,   // Tinted apothecary glass bottles
  PORC: 0xd8dde6,    // Crisp pearl porcelain wash basins
  CLOTH: 0xcbd5e1,   // Crisp linen towels & appointment book
  CAB: 0x1f242d,     // Matte charcoal cabinetry
  BLOCK: 0x12141a,   // Architectural partition walls
};
