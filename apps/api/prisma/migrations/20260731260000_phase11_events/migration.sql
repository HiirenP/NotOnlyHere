-- Phase 11: standalone events, RSVPs, and reminders

CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');
CREATE TYPE "RsvpStatus" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING');
CREATE TYPE "EventReminderKind" AS ENUM ('HOURS_24', 'HOURS_1');

CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "creator_user_id" UUID,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "time_zone" TEXT NOT NULL,
    "location_name" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'PUBLISHED',
    "schedule_version" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "events_schedule_version_check" CHECK ("schedule_version" > 0),
    CONSTRAINT "events_time_check" CHECK ("ends_at" > "starts_at")
);

CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE INDEX "events_status_starts_at_id_idx" ON "events"("status", "starts_at", "id");

ALTER TABLE "events" ADD CONSTRAINT "events_creator_user_id_fkey"
  FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "event_schedule_versions" (
    "event_id" UUID NOT NULL,
    "schedule_version" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "time_zone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_schedule_versions_pkey" PRIMARY KEY ("event_id", "schedule_version"),
    CONSTRAINT "event_schedule_versions_time_check" CHECK ("ends_at" > "starts_at")
);

ALTER TABLE "event_schedule_versions" ADD CONSTRAINT "event_schedule_versions_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "event_rsvps" (
    "event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "RsvpStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("event_id", "user_id")
);

CREATE INDEX "event_rsvps_user_id_status_event_id_idx" ON "event_rsvps"("user_id", "status", "event_id");

ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "event_reminders" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" "EventReminderKind" NOT NULL,
    "schedule_version" INTEGER NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "email_delivery_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_reminders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "event_reminders_event_id_user_id_kind_schedule_version_key"
  ON "event_reminders"("event_id", "user_id", "kind", "schedule_version");
CREATE INDEX "event_reminders_remind_at_idx" ON "event_reminders"("remind_at");

ALTER TABLE "event_reminders" ADD CONSTRAINT "event_reminders_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_reminders" ADD CONSTRAINT "event_reminders_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_reminders" ADD CONSTRAINT "event_reminders_event_id_schedule_version_fkey"
  FOREIGN KEY ("event_id", "schedule_version") REFERENCES "event_schedule_versions"("event_id", "schedule_version")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_reminders" ADD CONSTRAINT "event_reminders_email_delivery_id_fkey"
  FOREIGN KEY ("email_delivery_id") REFERENCES "email_deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
