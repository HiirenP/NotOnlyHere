-- Phase 12: Ava AI conversations, consent, and usage quota

CREATE TYPE "AiRole" AS ENUM ('USER', 'ASSISTANT');
CREATE TYPE "AiConsentType" AS ENUM ('AI_USE', 'PERSONALIZATION', 'CIRCLE_RECOMMENDATIONS');

CREATE TABLE "ai_consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "consent_type" "AiConsentType" NOT NULL,
    "document_version" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "revokes_consent_id" UUID,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_consents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_consents_user_id_consent_type_recorded_at_id_idx"
  ON "ai_consents"("user_id", "consent_type", "recorded_at" DESC, "id" DESC);

ALTER TABLE "ai_consents" ADD CONSTRAINT "ai_consents_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_consents" ADD CONSTRAINT "ai_consents_revokes_consent_id_fkey"
  FOREIGN KEY ("revokes_consent_id") REFERENCES "ai_consents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ai_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "preference_key" TEXT NOT NULL,
    "value_ciphertext" BYTEA NOT NULL,
    "value_key_version" INTEGER NOT NULL,
    "value_nonce" BYTEA,
    "consent_id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_preferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_preferences_user_id_preference_key_key"
  ON "ai_preferences"("user_id", "preference_key");

ALTER TABLE "ai_preferences" ADD CONSTRAINT "ai_preferences_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_preferences" ADD CONSTRAINT "ai_preferences_consent_id_fkey"
  FOREIGN KEY ("consent_id") REFERENCES "ai_consents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ai_conversations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title_ciphertext" BYTEA,
    "title_key_version" INTEGER,
    "title_nonce" BYTEA,
    "provider_conversation_ref" TEXT,
    "prompt_template_version" TEXT NOT NULL,
    "last_message_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_conversations_user_id_last_message_at_idx"
  ON "ai_conversations"("user_id", "last_message_at" DESC);

ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ai_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "role" "AiRole" NOT NULL,
    "content_ciphertext" BYTEA NOT NULL,
    "content_key_version" INTEGER NOT NULL,
    "content_nonce" BYTEA,
    "provider" TEXT,
    "model" TEXT,
    "provider_request_id" TEXT,
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "latency_ms" INTEGER,
    "consent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_messages_conversation_id_created_at_id_idx"
  ON "ai_messages"("conversation_id", "created_at", "id");

ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_fkey"
  FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_consent_id_fkey"
  FOREIGN KEY ("consent_id") REFERENCES "ai_consents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ai_usage_daily" (
    "user_id" UUID NOT NULL,
    "usage_date" DATE NOT NULL,
    "accepted_message_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_usage_daily_pkey" PRIMARY KEY ("user_id", "usage_date"),
    CONSTRAINT "ai_usage_daily_count_check" CHECK ("accepted_message_count" BETWEEN 0 AND 50)
);

ALTER TABLE "ai_usage_daily" ADD CONSTRAINT "ai_usage_daily_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
