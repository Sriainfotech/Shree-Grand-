import { facilities } from "@/data/facilities";

/**
 * Hotspots for the future 3D property scene.
 *
 * `position` is a normalised 2D coordinate on the placeholder visual.
 * When a real GLB/GLTF model is loaded, add a `vector3` field here and the
 * <Hotspot /> component will project it to screen space instead.
 */
export type Hotspot = {
  id: string;
  label: string;
  facilitySlug: string;
  position: { x: number; y: number };
  vector3?: [number, number, number];
};

const map: [string, string, number, number][] = [
  ["pool", "Swimming Pool", 26, 82],
  ["rooms", "Rooms", 30, 52],
  ["lawn", "Lawn Area", 62, 74],
  ["hall", "Party Hall", 55, 45],
  ["dining", "Dining Area", 70, 56],
  ["bbq", "Barbecue Area", 82, 66],
  ["campfire", "Campfire", 16, 62],
  ["garden", "Garden", 88, 44],
  ["parking", "Parking", 44, 90],
  ["play", "Children's Play Area", 8, 44],
];

// Fails loudly in dev instead of silently mismapping: a hotspot whose id
// doesn't match any facility's `hotspot` field used to fall back to
// "swimming-pool", so clicking it would silently show the wrong facility.
export const hotspots: Hotspot[] = map.map(([id, label, x, y]) => {
  const match = facilities.find((f) => f.hotspot === id);
  if (import.meta.env.DEV && !match) {
    console.warn(`[hotspots] "${id}" (${label}) has no matching facility.hotspot`);
  }
  return {
    id,
    label,
    facilitySlug: match?.slug ?? id,
    position: { x, y },
  };
});
