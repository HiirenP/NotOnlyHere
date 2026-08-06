-- Phase 13: AI moderation-assist flags

CREATE TYPE "AiFlagStatus" AS ENUM ('OPEN', 'REVIEWED', 'DISMISSED', 'ACTIONED');

CREATE TABLE "ai_mod_flags" (
    "id" UUID NOT NULL,
    "post_id" UUID,
    "comment_id" UUID,
    "category" TEXT NOT NULL,
    "confidence" DECIMAL(5,4),
    "status" "AiFlagStatus" NOT NULL DEFAULT 'OPEN',
    "model_version" TEXT NOT NULL,
    "rationale_code" TEXT,
    "reviewed_by_user_id" UUID,
    "reviewed_at" TIMESTAMP(3),
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_mod_flags_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_mod_flags_target_check" CHECK (
      ("post_id" IS NOT NULL AND "comment_id" IS NULL) OR
      ("post_id" IS NULL AND "comment_id" IS NOT NULL)
    ),
    CONSTRAINT "ai_mod_flags_confidence_check" CHECK (
      "confidence" IS NULL OR ("confidence" >= 0 AND "confidence" <= 1)
    )
);

CREATE INDEX "ai_mod_flags_status_created_at_idx" ON "ai_mod_flags"("status", "created_at");
CREATE INDEX "ai_mod_flags_post_id_idx" ON "ai_mod_flags"("post_id");
CREATE INDEX "ai_mod_flags_comment_id_idx" ON "ai_mod_flags"("comment_id");

ALTER TABLE "ai_mod_flags" ADD CONSTRAINT "ai_mod_flags_post_id_fkey"
  FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_mod_flags" ADD CONSTRAINT "ai_mod_flags_comment_id_fkey"
  FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_mod_flags" ADD CONSTRAINT "ai_mod_flags_reviewed_by_user_id_fkey"
  FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
