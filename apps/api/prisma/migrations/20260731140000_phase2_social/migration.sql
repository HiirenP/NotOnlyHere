-- Phase 2: profiles, connections, blocks, media, exports, activity
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE "MediaPurpose" AS ENUM ('AVATAR', 'PROFILE_COVER', 'POST_IMAGE', 'BLOG_IMAGE', 'RESOURCE_MEDIA');
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'READY', 'FAILED', 'DELETED');
CREATE TYPE "AccountExportStatus" AS ENUM ('QUEUED', 'PROCESSING', 'READY', 'FAILED', 'EXPIRED');
CREATE TYPE "ActivityType" AS ENUM ('PROFILE_UPDATED', 'CONNECTION_ACCEPTED');

CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "owner_user_id" UUID,
    "purpose" "MediaPurpose" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "object_key" TEXT NOT NULL,
    "original_filename" TEXT,
    "declared_mime" TEXT,
    "detected_mime" TEXT,
    "byte_size" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "connections" (
    "id" UUID NOT NULL,
    "requester_id" UUID NOT NULL,
    "addressee_id" UUID NOT NULL,
    "status" "ConnectionStatus" NOT NULL,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_blocks" (
    "blocker_id" UUID NOT NULL,
    "blocked_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("blocker_id","blocked_id")
);

CREATE TABLE "account_exports" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "AccountExportStatus" NOT NULL,
    "object_key" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "error_code" TEXT,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_exports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "activity_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "profiles" ADD COLUMN "avatar_media_id" UUID;
ALTER TABLE "profiles" ADD COLUMN "cover_media_id" UUID;

CREATE UNIQUE INDEX "media_assets_object_key_key" ON "media_assets"("object_key");
CREATE INDEX "media_assets_owner_user_id_created_at_idx" ON "media_assets"("owner_user_id", "created_at");
CREATE INDEX "media_assets_status_created_at_idx" ON "media_assets"("status", "created_at");

CREATE UNIQUE INDEX "connections_requester_id_addressee_id_key" ON "connections"("requester_id", "addressee_id");
CREATE INDEX "connections_addressee_id_status_created_at_idx" ON "connections"("addressee_id", "status", "created_at");
CREATE INDEX "connections_requester_id_status_idx" ON "connections"("requester_id", "status");

CREATE INDEX "user_blocks_blocked_id_blocker_id_idx" ON "user_blocks"("blocked_id", "blocker_id");

CREATE UNIQUE INDEX "account_exports_object_key_key" ON "account_exports"("object_key");
CREATE UNIQUE INDEX "account_exports_user_id_idempotency_key_key" ON "account_exports"("user_id", "idempotency_key");
CREATE INDEX "account_exports_user_id_requested_at_idx" ON "account_exports"("user_id", "requested_at");

CREATE INDEX "activity_events_user_id_occurred_at_idx" ON "activity_events"("user_id", "occurred_at" DESC);

ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "connections" ADD CONSTRAINT "connections_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "connections" ADD CONSTRAINT "connections_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_exports" ADD CONSTRAINT "account_exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_avatar_media_id_fkey" FOREIGN KEY ("avatar_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "connections_normalized_pair_idx" ON "connections" (
  LEAST("requester_id"::text, "addressee_id"::text),
  GREATEST("requester_id"::text, "addressee_id"::text)
);

ALTER TABLE "connections" ADD CONSTRAINT "connections_users_differ_chk" CHECK ("requester_id" <> "addressee_id");
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_users_differ_chk" CHECK ("blocker_id" <> "blocked_id");
