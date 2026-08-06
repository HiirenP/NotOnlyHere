-- CreateEnum
CREATE TYPE "AnalyticsExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "analytics_event_definitions" (
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "allowed_properties" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_event_definitions_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "analytics_event_dedup" (
    "id" UUID NOT NULL,
    "first_occurred_at" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_event_dedup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_key" TEXT NOT NULL,
    "event_version" INTEGER NOT NULL,
    "user_id" UUID,
    "anonymous_id_hash" BYTEA,
    "session_id_hash" BYTEA,
    "properties" JSONB NOT NULL DEFAULT '{}',
    "source" TEXT NOT NULL,
    "request_id" TEXT,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_daily_aggregates" (
    "metric_date" DATE NOT NULL,
    "metric_key" TEXT NOT NULL,
    "dimension_key" TEXT NOT NULL DEFAULT 'all',
    "dimension_value" TEXT NOT NULL DEFAULT 'all',
    "value_numeric" DECIMAL(20,4) NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_window_end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_daily_aggregates_pkey" PRIMARY KEY ("metric_date","metric_key","dimension_key","dimension_value")
);

-- CreateTable
CREATE TABLE "analytics_exports" (
    "id" UUID NOT NULL,
    "requested_by_user_id" UUID,
    "report_type" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "status" "AnalyticsExportStatus" NOT NULL DEFAULT 'PENDING',
    "object_key" TEXT,
    "expires_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_exports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_event_key_occurred_at_idx" ON "analytics_events"("event_key", "occurred_at");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_occurred_at_idx" ON "analytics_events"("user_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_exports_object_key_key" ON "analytics_exports"("object_key");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_exports_requested_by_user_id_idempotency_key_key" ON "analytics_exports"("requested_by_user_id", "idempotency_key");

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_event_key_fkey" FOREIGN KEY ("event_key") REFERENCES "analytics_event_definitions"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_exports" ADD CONSTRAINT "analytics_exports_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
