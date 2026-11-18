/*
  Warnings:

  - You are about to drop the column `roomId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_roomId_fkey";

-- DropIndex
DROP INDEX "bookings_roomId_checkIn_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "roomId",
ADD COLUMN     "totalAmount" DOUBLE PRECISION;

-- DropTable
DROP TABLE "rooms";

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL DEFAULT 'property',
    "name" TEXT NOT NULL DEFAULT 'Shri Grand Farm Stay',
    "description" TEXT NOT NULL DEFAULT '',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "guestCapacity" INTEGER,
    "pricePerDay" DOUBLE PRECISION,
    "priceLabel" TEXT NOT NULL DEFAULT 'Price on request',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);
