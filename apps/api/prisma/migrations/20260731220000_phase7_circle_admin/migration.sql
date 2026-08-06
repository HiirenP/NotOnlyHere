-- Phase 7: circle mutes and admin participation controls

CREATE TABLE "circle_mutes" (
    "circle_id" UUID NOT NULL,
    "muted_user_id" UUID NOT NULL,
    "muted_by_user_id" UUID,
    "reason" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circle_mutes_pkey" PRIMARY KEY ("circle_id","muted_user_id")
);

ALTER TABLE "circle_mutes" ADD CONSTRAINT "circle_mutes_circle_id_fkey"
  FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_mutes" ADD CONSTRAINT "circle_mutes_muted_user_id_fkey"
  FOREIGN KEY ("muted_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "circle_mutes" ADD CONSTRAINT "circle_mutes_muted_by_user_id_fkey"
  FOREIGN KEY ("muted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
