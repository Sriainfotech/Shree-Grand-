/**
 * Central image registry.
 *
 * IMPORTANT: every image below is a generic placeholder visual, NOT a
 * photograph of Shri Grand Farm Stay. When real property photography,
 * drone footage or renders are supplied, replace the imports here only —
 * no component references image files directly.
 */
import heroFarmstay from "@/assets/hero-farmstay.jpg";
import propertyAerial from "@/assets/property-aerial.jpg";
import facilityPool from "@/assets/facility-pool.jpg";
import facilityLawn from "@/assets/facility-lawn.jpg";
import facilityHall from "@/assets/facility-hall.jpg";
import facilityRoom from "@/assets/facility-room.jpg";
import facilityDining from "@/assets/facility-dining.jpg";
import facilityCampfire from "@/assets/facility-campfire.jpg";
import facilityGarden from "@/assets/facility-garden.jpg";
import experienceWedding from "@/assets/experience-wedding.jpg";
import experienceBirthday from "@/assets/experience-birthday.jpg";
import experienceCorporate from "@/assets/experience-corporate.jpg";

export const images = {
  hero: heroFarmstay,
  aerial: propertyAerial,
  pool: facilityPool,
  lawn: facilityLawn,
  hall: facilityHall,
  room: facilityRoom,
  dining: facilityDining,
  campfire: facilityCampfire,
  garden: facilityGarden,
  wedding: experienceWedding,
  birthday: experienceBirthday,
  corporate: experienceCorporate,
} as const;

export type ImageKey = keyof typeof images;

/** Shown wherever placeholder imagery is used, so nothing is misrepresented. */
export const PLACEHOLDER_IMAGE_NOTE =
  "Representative imagery. Actual property photography will be published soon.";
