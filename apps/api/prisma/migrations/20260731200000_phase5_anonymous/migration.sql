-- Phase 5: anonymous posts/comments, daily quota, admin reveal audit

ALTER TABLE "posts" DROP CONSTRAINT "posts_author_user_id_fkey";
ALTER TABLE "posts" ALTER COLUMN "author_user_id" DROP NOT NULL;
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_fkey"
  FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "comments" DROP CONSTRAINT "comments_author_user_id_fkey";
ALTER TABLE "comments" ALTER COLUMN "author_user_id" DROP NOT NULL;
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_user_id_fkey"
  FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "post_anonymous_authors" (
    "post_id" UUID NOT NULL,
    "user_id" UUID,
    "display_label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_anonymous_authors_pkey" PRIMARY KEY ("post_id")
);

CREATE TABLE "comment_anonymous_authors" (
    "comment_id" UUID NOT NULL,
    "user_id" UUID,
    "display_label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comment_anonymous_authors_pkey" PRIMARY KEY ("comment_id")
);

CREATE TABLE "anonymous_usage_daily" (
    "user_id" UUID NOT NULL,
    "usage_date" DATE NOT NULL,
    "contribution_count" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "anonymous_usage_daily_pkey" PRIMARY KEY ("user_id","usage_date"),
    CONSTRAINT "anonymous_usage_daily_contribution_count_check"
      CHECK ("contribution_count" >= 0 AND "contribution_count" <= 10)
);

CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_user_id" UUID,
    "impersonated_user_id" UUID,
    "actor_reference" UUID,
    "actor_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" UUID,
    "result" TEXT NOT NULL,
    "request_id" TEXT,
    "trace_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_occurred_at_idx" ON "audit_logs"("occurred_at" DESC);
CREATE INDEX "audit_logs_actor_user_id_occurred_at_idx" ON "audit_logs"("actor_user_id", "occurred_at" DESC);
CREATE INDEX "audit_logs_target_type_target_id_occurred_at_idx" ON "audit_logs"("target_type", "target_id", "occurred_at" DESC);

ALTER TABLE "post_anonymous_authors" ADD CONSTRAINT "post_anonymous_authors_post_id_fkey"
  FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_anonymous_authors" ADD CONSTRAINT "post_anonymous_authors_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "comment_anonymous_authors" ADD CONSTRAINT "comment_anonymous_authors_comment_id_fkey"
  FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comment_anonymous_authors" ADD CONSTRAINT "comment_anonymous_authors_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "anonymous_usage_daily" ADD CONSTRAINT "anonymous_usage_daily_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
