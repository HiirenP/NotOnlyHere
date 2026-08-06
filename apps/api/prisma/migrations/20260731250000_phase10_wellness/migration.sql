-- Phase 10: wellness mood check-ins

CREATE TABLE "wellness_checkins" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "mood" SMALLINT NOT NULL,
    "note_ciphertext" BYTEA,
    "note_key_version" TEXT,
    "note_nonce" BYTEA,
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "local_date" DATE NOT NULL,
    "time_zone" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wellness_checkins_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "wellness_checkins_mood_check" CHECK ("mood" BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX "wellness_checkins_user_id_local_date_key" ON "wellness_checkins"("user_id", "local_date");
CREATE INDEX "wellness_checkins_user_id_checked_in_at_idx" ON "wellness_checkins"("user_id", "checked_in_at" DESC);

ALTER TABLE "wellness_checkins" ADD CONSTRAINT "wellness_checkins_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
