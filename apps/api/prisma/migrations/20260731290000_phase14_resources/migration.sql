-- Phase 14: resource library and progress

CREATE TYPE "ResourceKind" AS ENUM ('ARTICLE', 'VIDEO', 'WORKSHEET');
CREATE TYPE "ResourceAccess" AS ENUM ('PUBLIC_FREE', 'MEMBER', 'PAID_ONCE');

CREATE TABLE "resources" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "ResourceKind" NOT NULL,
    "access" "ResourceAccess" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body_rich" JSONB,
    "body_plain" TEXT,
    "media_asset_id" UUID,
    "external_video_url" TEXT,
    "price_minor" BIGINT,
    "currency" CHAR(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_by_user_id" UUID,
    "updated_by_user_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resources_status_check" CHECK ("status" IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");
CREATE INDEX "resources_status_access_published_at_idx" ON "resources"("status", "access", "published_at" DESC);
CREATE INDEX "resources_kind_status_idx" ON "resources"("kind", "status");

ALTER TABLE "resources" ADD CONSTRAINT "resources_media_asset_id_fkey"
  FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "resources" ADD CONSTRAINT "resources_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "resources" ADD CONSTRAINT "resources_updated_by_user_id_fkey"
  FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "resource_progress" (
    "resource_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "last_position_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_progress_pkey" PRIMARY KEY ("resource_id", "user_id"),
    CONSTRAINT "resource_progress_percent_check" CHECK ("progress_percent" BETWEEN 0 AND 100),
    CONSTRAINT "resource_progress_position_check" CHECK ("last_position_seconds" IS NULL OR "last_position_seconds" >= 0)
);

CREATE INDEX "resource_progress_user_id_updated_at_idx" ON "resource_progress"("user_id", "updated_at" DESC);

ALTER TABLE "resource_progress" ADD CONSTRAINT "resource_progress_resource_id_fkey"
  FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resource_progress" ADD CONSTRAINT "resource_progress_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
