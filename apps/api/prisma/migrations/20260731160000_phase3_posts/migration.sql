-- Phase 3: posts and feed
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'MEMBERS', 'CONNECTIONS', 'ONLY_ME');
CREATE TYPE "ContentStatus" AS ENUM ('ACTIVE', 'DELETED');

ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'POST_CREATED';

CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "author_user_id" UUID NOT NULL,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "circle_id" UUID,
    "body" TEXT NOT NULL,
    "visibility" "PostVisibility" NOT NULL DEFAULT 'MEMBERS',
    "status" "ContentStatus" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "posts_created_at_id_idx" ON "posts"("created_at" DESC, "id" DESC);
CREATE INDEX "posts_author_user_id_created_at_idx" ON "posts"("author_user_id", "created_at" DESC);
CREATE INDEX "posts_active_feed_idx" ON "posts"("created_at" DESC, "id" DESC) WHERE "status" = 'ACTIVE';

ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
