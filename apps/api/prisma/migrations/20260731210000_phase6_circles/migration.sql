-- Phase 6: circles directory and membership

CREATE TYPE "CircleVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');
CREATE TYPE "CircleJoinPolicy" AS ENUM ('OPEN', 'APPROVAL', 'PRIVATE');
CREATE TYPE "CircleRole" AS ENUM ('MEMBER', 'ADMIN');
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'DECLINED', 'LEFT', 'REMOVED');
CREATE TYPE "CircleStatus" AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');

CREATE TABLE "circles" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "guidelines" TEXT NOT NULL,
    "visibility" "CircleVisibility" NOT NULL,
    "join_policy" "CircleJoinPolicy" NOT NULL,
    "created_by_user_id" UUID,
    "avatar_media_id" UUID,
    "status" "CircleStatus" NOT NULL DEFAULT 'ACTIVE',
    "admin_featured" BOOLEAN NOT NULL DEFAULT false,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "circles_slug_key" ON "circles"("slug");
CREATE INDEX "circles_status_created_at_idx" ON "circles"("status", "created_at" DESC);
CREATE INDEX "circles_directory_idx" ON "circles"("created_at" DESC, "id" DESC)
  WHERE "status" = 'ACTIVE' AND "visibility" != 'HIDDEN';

CREATE TABLE "circle_members" (
    "circle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "CircleRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "requested_at" TIMESTAMP(3),
    "joined_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),
    "invited_by_user_id" UUID,
    "decided_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circle_members_pkey" PRIMARY KEY ("circle_id","user_id")
);

CREATE INDEX "circle_members_user_id_status_joined_at_idx" ON "circle_members"("user_id", "status", "joined_at");
CREATE INDEX "circle_members_circle_id_role_idx" ON "circle_members"("circle_id", "role")
  WHERE "status" = 'ACTIVE';

CREATE TABLE "circle_invites" (
    "id" UUID NOT NULL,
    "circle_id" UUID NOT NULL,
    "inviter_user_id" UUID,
    "invitee_user_id" UUID,
    "invitee_email" TEXT,
    "token_hash" BYTEA NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "declined_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "accepted_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circle_invites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "circle_invites_token_hash_key" ON "circle_invites"("token_hash");
CREATE INDEX "circle_invites_circle_id_created_at_idx" ON "circle_invites"("circle_id", "created_at");
CREATE INDEX "circle_invites_invitee_user_id_expires_at_idx" ON "circle_invites"("invitee_user_id", "expires_at");

ALTER TABLE "circles" ADD CONSTRAINT "circles_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "circles" ADD CONSTRAINT "circles_avatar_media_id_fkey"
  FOREIGN KEY ("avatar_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_circle_id_fkey"
  FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_invited_by_user_id_fkey"
  FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_decided_by_user_id_fkey"
  FOREIGN KEY ("decided_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "circle_invites" ADD CONSTRAINT "circle_invites_circle_id_fkey"
  FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_invites" ADD CONSTRAINT "circle_invites_inviter_user_id_fkey"
  FOREIGN KEY ("inviter_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "circle_invites" ADD CONSTRAINT "circle_invites_invitee_user_id_fkey"
  FOREIGN KEY ("invitee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_invites" ADD CONSTRAINT "circle_invites_accepted_by_user_id_fkey"
  FOREIGN KEY ("accepted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "posts" ADD CONSTRAINT "posts_circle_id_fkey"
  FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
