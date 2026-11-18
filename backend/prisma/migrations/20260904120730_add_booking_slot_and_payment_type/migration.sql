-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "slot" TEXT NOT NULL DEFAULT 'full_day';

-- CreateIndex
CREATE INDEX "bookings_roomId_checkIn_idx" ON "bookings"("roomId", "checkIn");
