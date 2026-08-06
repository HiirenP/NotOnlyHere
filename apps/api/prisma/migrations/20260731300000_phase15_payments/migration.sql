-- Phase 15: Stripe donations, resource purchases, and entitlements

CREATE TYPE "DonationFrequency" AS ENUM ('ONE_TIME', 'MONTHLY');
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'FAILED', 'REFUNDED');
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "public_id" UUID NOT NULL,
    "user_id" UUID,
    "donor_reference" UUID NOT NULL,
    "frequency" "DonationFrequency" NOT NULL,
    "amount_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "stripe_customer_id" TEXT,
    "stripe_checkout_session_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "stripe_subscription_id" TEXT,
    "idempotency_key" TEXT,
    "started_at" TIMESTAMP(3),
    "succeeded_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "donations_amount_check" CHECK ("amount_minor" > 0)
);

CREATE UNIQUE INDEX "donations_public_id_key" ON "donations"("public_id");
CREATE UNIQUE INDEX "donations_stripe_checkout_session_id_key" ON "donations"("stripe_checkout_session_id");
CREATE UNIQUE INDEX "donations_stripe_payment_intent_id_key" ON "donations"("stripe_payment_intent_id");
CREATE UNIQUE INDEX "donations_stripe_subscription_id_key" ON "donations"("stripe_subscription_id");
CREATE INDEX "donations_status_created_at_idx" ON "donations"("status", "created_at");
CREATE INDEX "donations_user_id_created_at_idx" ON "donations"("user_id", "created_at");

ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "donation_payments" (
    "id" UUID NOT NULL,
    "donation_id" UUID NOT NULL,
    "stripe_invoice_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "amount_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "status" TEXT NOT NULL,
    "period_start" TIMESTAMP(3),
    "period_end" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "donation_payments_amount_check" CHECK ("amount_minor" > 0)
);

CREATE UNIQUE INDEX "donation_payments_stripe_invoice_id_key" ON "donation_payments"("stripe_invoice_id");
CREATE UNIQUE INDEX "donation_payments_stripe_payment_intent_id_key" ON "donation_payments"("stripe_payment_intent_id");
CREATE INDEX "donation_payments_donation_id_created_at_idx" ON "donation_payments"("donation_id", "created_at");

ALTER TABLE "donation_payments" ADD CONSTRAINT "donation_payments_donation_id_fkey"
  FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "resource_purchases" (
    "id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "user_id" UUID,
    "purchaser_reference" UUID NOT NULL,
    "amount_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "stripe_checkout_session_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "price_snapshot" JSONB NOT NULL,
    "paid_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_purchases_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resource_purchases_amount_check" CHECK ("amount_minor" > 0)
);

CREATE UNIQUE INDEX "resource_purchases_stripe_checkout_session_id_key" ON "resource_purchases"("stripe_checkout_session_id");
CREATE UNIQUE INDEX "resource_purchases_stripe_payment_intent_id_key" ON "resource_purchases"("stripe_payment_intent_id");
CREATE INDEX "resource_purchases_user_id_status_created_at_idx" ON "resource_purchases"("user_id", "status", "created_at");
CREATE INDEX "resource_purchases_resource_id_status_idx" ON "resource_purchases"("resource_id", "status");

ALTER TABLE "resource_purchases" ADD CONSTRAINT "resource_purchases_resource_id_fkey"
  FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "resource_purchases" ADD CONSTRAINT "resource_purchases_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "resource_entitlements" (
    "id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purchase_id" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revocation_reason" TEXT,

    CONSTRAINT "resource_entitlements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "resource_entitlements_purchase_id_key" ON "resource_entitlements"("purchase_id");
CREATE UNIQUE INDEX "resource_entitlements_resource_id_user_id_key" ON "resource_entitlements"("resource_id", "user_id");

ALTER TABLE "resource_entitlements" ADD CONSTRAINT "resource_entitlements_resource_id_fkey"
  FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "resource_entitlements" ADD CONSTRAINT "resource_entitlements_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "resource_entitlements" ADD CONSTRAINT "resource_entitlements_purchase_id_fkey"
  FOREIGN KEY ("purchase_id") REFERENCES "resource_purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "stripe_events" (
    "id" UUID NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "api_version" TEXT,
    "object_id" TEXT,
    "livemode" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB NOT NULL,
    "provider_created_at" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "processing_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error_code" TEXT,

    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "stripe_events_stripe_event_id_key" ON "stripe_events"("stripe_event_id");
CREATE INDEX "stripe_events_processed_at_received_at_idx" ON "stripe_events"("processed_at", "received_at");
