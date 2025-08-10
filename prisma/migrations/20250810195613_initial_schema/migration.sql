-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('learner', 'expert');

-- CreateEnum
CREATE TYPE "public"."SlotState" AS ENUM ('open', 'held', 'booked', 'blocked');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('pending', 'awaiting_confirmation', 'confirmed', 'completed', 'cancelled', 'refunded', 'no_show');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('requires_capture', 'paid', 'refunded');

-- CreateEnum
CREATE TYPE "public"."NotificationChannel" AS ENUM ('email', 'in_app');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING_AWAITING_CONFIRMATION', 'BOOKING_CONFIRMED_ICS', 'BOOKING_DECLINED', 'REMINDER_24H');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "timeZone" TEXT,
    "locale" TEXT,
    "role" "public"."Role" NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExpertProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "headline" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "avgRating" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpertProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AvailabilitySlot" (
    "id" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "state" "public"."SlotState" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "expertUserId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "status" "public"."BookingStatus" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "learnerTimeZone" TEXT,
    "expertTimeZone" TEXT,
    "noteToExpert" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "paymentMethodId" TEXT,
    "captureOnAccept" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."PaymentStatus" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "refundedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "meetingId" TEXT,
    "hostJoinUrl" TEXT,
    "participantJoinUrl" TEXT,
    "password" TEXT,
    "scheduledStartAt" TIMESTAMP(3),
    "scheduledEndAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "toUserId" TEXT,
    "type" "public"."NotificationType" NOT NULL,
    "channel" "public"."NotificationChannel" NOT NULL,
    "subject" TEXT,
    "payload" JSONB NOT NULL,
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "bookingId" TEXT,
    "paymentId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseUserId_key" ON "public"."User"("supabaseUserId");

-- CreateIndex
CREATE INDEX "User_role_createdAt_idx" ON "public"."User"("role", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExpertProfile_userId_key" ON "public"."ExpertProfile"("userId");

-- CreateIndex
CREATE INDEX "ExpertProfile_isPublished_createdAt_idx" ON "public"."ExpertProfile"("isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_expertProfileId_startAt_idx" ON "public"."AvailabilitySlot"("expertProfileId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_slotId_key" ON "public"."Booking"("slotId");

-- CreateIndex
CREATE INDEX "Booking_expertProfileId_createdAt_idx" ON "public"."Booking"("expertProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_learnerId_createdAt_idx" ON "public"."Booking"("learnerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "public"."Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentIntentId_key" ON "public"."Payment"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "public"."Payment"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_bookingId_key" ON "public"."Session"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "public"."Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_expertProfileId_createdAt_idx" ON "public"."Review"("expertProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_toUserId_createdAt_idx" ON "public"."Notification"("toUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_createdAt_idx" ON "public"."Notification"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "public"."AuditLog"("entityType", "entityId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."ExpertProfile" ADD CONSTRAINT "ExpertProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "public"."ExpertProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_expertUserId_fkey" FOREIGN KEY ("expertUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "public"."ExpertProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."AvailabilitySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "public"."ExpertProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
