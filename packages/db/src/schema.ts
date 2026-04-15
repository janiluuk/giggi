import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const gigTypeEnum = pgEnum("gig_type", ["REQUEST", "OFFER"]);
export const locationTypeEnum = pgEnum("location_type", ["ONSITE", "REMOTE", "WORKER_PLACE"]);
export const compensationTypeEnum = pgEnum("compensation_type", [
  "FIXED",
  "HOURLY",
  "NEGOTIABLE"
]);
export const paymentTimingEnum = pgEnum("payment_timing", [
  "AFTER_COMPLETION",
  "PARTIAL_UPFRONT_THEN_COMPLETION",
  "FLEXIBLE_DISCUSS"
]);
export const paymentMethodEnum = pgEnum("payment_method", ["CASH", "MOBILE_OR_BANK", "OTHER"]);
export const agreementStatusEnum = pgEnum("agreement_status", [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "DISPUTED",
  "CANCELLED"
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nickname: varchar("nickname", { length: 80 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 40 }),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
  ratingAverage: integer("rating_average").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  cancellationRate: integer("cancellation_rate").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  bio: text("bio"),
  skills: text("skills").array().default([]).notNull(),
  resumeData: jsonb("resume_data"),
  visibilityLevel: varchar("visibility_level", { length: 24 }).default("public").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const gigs = pgTable("gigs", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: gigTypeEnum("type").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  tags: jsonb("tags").default([]).notNull(),
  locationType: locationTypeEnum("location_type").notNull(),
  locationData: jsonb("location_data").notNull(),
  compensationType: compensationTypeEnum("compensation_type").notNull(),
  compensationAmount: integer("compensation_amount"),
  paymentTimingPreference: paymentTimingEnum("payment_timing_preference"),
  paymentMethodPreference: paymentMethodEnum("payment_method_preference"),
  paymentContactHint: varchar("payment_contact_hint", { length: 140 }),
  effortLevel: varchar("effort_level", { length: 24 }).notNull(),
  urgency: varchar("urgency", { length: 24 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const agreements = pgTable("agreements", {
  id: uuid("id").defaultRandom().primaryKey(),
  gigId: uuid("gig_id")
    .references(() => gigs.id, { onDelete: "cascade" })
    .notNull(),
  clientId: uuid("client_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  workerId: uuid("worker_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  scheduledTime: timestamp("scheduled_time", { withTimezone: true }),
  location: text("location"),
  price: integer("price"),
  checklist: jsonb("checklist").default([]).notNull(),
  paymentTiming: paymentTimingEnum("payment_timing").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentContactDetail: varchar("payment_contact_detail", { length: 140 }),
  status: agreementStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

