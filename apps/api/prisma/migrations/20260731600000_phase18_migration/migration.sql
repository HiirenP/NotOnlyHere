-- CreateEnum
CREATE TYPE "MigrationEntityType" AS ENUM ('USER', 'CIRCLE', 'POST', 'COMMENT', 'BLOG_POST', 'MEDIA');

-- CreateEnum
CREATE TYPE "MigrationMapStatus" AS ENUM ('PENDING', 'IMPORTED', 'SKIPPED', 'FAILED');

-- CreateEnum
CREATE TYPE "MigrationRunStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "migration_runs" (
    "id" UUID NOT NULL,
    "source_system" TEXT NOT NULL,
    "dry_run" BOOLEAN NOT NULL DEFAULT false,
    "status" "MigrationRunStatus" NOT NULL DEFAULT 'RUNNING',
    "counts" JSONB NOT NULL DEFAULT '{}',
    "error_code" TEXT,
    "started_by_user_id" UUID,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "migration_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migration_source_maps" (
    "id" UUID NOT NULL,
    "run_id" UUID,
    "entity_type" "MigrationEntityType" NOT NULL,
    "source_system" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "target_id" UUID,
    "checksum" TEXT,
    "status" "MigrationMapStatus" NOT NULL DEFAULT 'PENDING',
    "error_code" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "migration_source_maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legacy_redirects" (
    "id" UUID NOT NULL,
    "source_path" TEXT NOT NULL,
    "target_path" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legacy_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "migration_runs_status_started_at_idx" ON "migration_runs"("status", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "migration_source_maps_source_system_entity_type_source_id_key" ON "migration_source_maps"("source_system", "entity_type", "source_id");

-- CreateIndex
CREATE INDEX "migration_source_maps_entity_type_status_idx" ON "migration_source_maps"("entity_type", "status");

-- CreateIndex
CREATE INDEX "migration_source_maps_run_id_idx" ON "migration_source_maps"("run_id");

-- CreateIndex
CREATE UNIQUE INDEX "legacy_redirects_source_path_key" ON "legacy_redirects"("source_path");

-- AddForeignKey
ALTER TABLE "migration_runs" ADD CONSTRAINT "migration_runs_started_by_user_id_fkey" FOREIGN KEY ("started_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "migration_source_maps" ADD CONSTRAINT "migration_source_maps_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "migration_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
