-- Phase 0 baseline migration
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'BANNED', 'DELETION_PENDING', 'ANONYMIZED');
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'DEAD');

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "email_verified_at" TIMESTAMP(3),
    "activated_at" TIMESTAMP(3),
    "age_attested_at" TIMESTAMP(3),
    "terms_version" TEXT NOT NULL,
    "privacy_version" TEXT NOT NULL,
    "community_guidelines_version" TEXT NOT NULL,
    "terms_accepted_at" TIMESTAMP(3) NOT NULL,
    "privacy_accepted_at" TIMESTAMP(3) NOT NULL,
    "community_guidelines_accepted_at" TIMESTAMP(3) NOT NULL,
    "locale" TEXT,
    "time_zone" TEXT,
    "last_login_at" TIMESTAMP(3),
    "deletion_requested_at" TIMESTAMP(3),
    "deletion_due_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "anonymized_reference" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "profiles" (
    "user_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "bio" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "session_families" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "absolute_expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revocation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_families_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "generation" INTEGER NOT NULL,
    "refresh_token_hash" BYTEA NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "rotated_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "replaced_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admin_roles" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admin_role_permissions" (
    "role_id" UUID NOT NULL,
    "permission" TEXT NOT NULL,
    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("role_id","permission")
);

CREATE TABLE "admin_user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_version" INTEGER NOT NULL DEFAULT 1,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "locked_at" TIMESTAMP(3),
    "locked_by" TEXT,
    "delivered_at" TIMESTAMP(3),
    "last_error_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "outbox_consumptions" (
    "consumer" TEXT NOT NULL,
    "event_id" UUID NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    CONSTRAINT "outbox_consumptions_pkey" PRIMARY KEY ("consumer","event_id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_anonymized_reference_key" ON "users"("anonymized_reference");
CREATE INDEX "users_status_created_at_idx" ON "users"("status", "created_at");
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
CREATE INDEX "session_families_user_id_revoked_at_idx" ON "session_families"("user_id", "revoked_at");
CREATE UNIQUE INDEX "sessions_family_id_generation_key" ON "sessions"("family_id", "generation");
CREATE INDEX "sessions_family_id_revoked_at_idx" ON "sessions"("family_id", "revoked_at");
CREATE UNIQUE INDEX "admin_roles_key_key" ON "admin_roles"("key");
CREATE INDEX "outbox_events_status_available_at_id_idx" ON "outbox_events"("status", "available_at", "id");

ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "session_families" ADD CONSTRAINT "session_families_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "session_families"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "outbox_consumptions" ADD CONSTRAINT "outbox_consumptions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "outbox_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
