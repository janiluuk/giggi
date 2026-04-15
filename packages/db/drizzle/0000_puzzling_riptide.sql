CREATE TYPE "public"."agreement_status" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'DISPUTED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."compensation_type" AS ENUM('FIXED', 'HOURLY', 'NEGOTIABLE');--> statement-breakpoint
CREATE TYPE "public"."gig_type" AS ENUM('REQUEST', 'OFFER');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('ONSITE', 'REMOTE', 'WORKER_PLACE');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'MOBILE_OR_BANK', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_timing" AS ENUM('AFTER_COMPLETION', 'PARTIAL_UPFRONT_THEN_COMPLETION', 'FLEXIBLE_DISCUSS');--> statement-breakpoint
CREATE TABLE "agreements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gig_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"worker_id" uuid NOT NULL,
	"scheduled_time" timestamp with time zone,
	"location" text,
	"price" integer,
	"checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"payment_timing" "payment_timing" NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_contact_detail" varchar(140),
	"status" "agreement_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gigs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "gig_type" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(120) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location_type" "location_type" NOT NULL,
	"location_data" jsonb NOT NULL,
	"compensation_type" "compensation_type" NOT NULL,
	"compensation_amount" integer,
	"payment_timing_preference" "payment_timing",
	"payment_method_preference" "payment_method",
	"payment_contact_hint" varchar(140),
	"effort_level" varchar(24) NOT NULL,
	"urgency" varchar(24) NOT NULL,
	"expires_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bio" text,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"resume_data" jsonb,
	"visibility_level" varchar(24) DEFAULT 'public' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(80) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone_number" varchar(40),
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"rating_average" integer DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"cancellation_rate" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_gig_id_gigs_id_fk" FOREIGN KEY ("gig_id") REFERENCES "public"."gigs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gigs" ADD CONSTRAINT "gigs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;