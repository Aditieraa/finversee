import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// ===== SUBSCRIPTION & PAYMENT SCHEMA =====
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  tier: varchar("tier").notNull().default("free"), // free, pro, premium
  status: varchar("status").notNull().default("active"), // active, cancelled, expired
  startDate: timestamp("start_date").notNull().default(sql`NOW()`),
  endDate: timestamp("end_date"),
  renewalDate: timestamp("renewal_date"),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  orderId: varchar("order_id").notNull().unique(),
  amount: integer("amount").notNull(), // in paise
  type: varchar("type").notNull(), // subscription, inapp, course
  itemId: varchar("item_id"), // what they bought
  paymentMethod: varchar("payment_method").notNull().default("dummy"), // dummy, razorpay, etc
  status: varchar("status").notNull().default("success"), // pending, success, failed
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const inAppPurchases = pgTable("in_app_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  itemId: varchar("item_id").notNull(),
  itemName: varchar("item_name").notNull(),
  category: varchar("category").notNull(), // booster, skin, mode
  amount: integer("amount").notNull(),
  purchasedAt: timestamp("purchased_at").notNull().default(sql`NOW()`),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in paise
  duration: integer("duration"), // days
  category: varchar("category").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  courseId: varchar("course_id").notNull(),
  enrolledAt: timestamp("enrolled_at").notNull().default(sql`NOW()`),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // 0-100%
});

export const userLimits = pgTable("user_limits", {
  userId: varchar("user_id").primaryKey(),
  aiRequestsToday: integer("ai_requests_today").default(0),
  maxAiRequests: integer("max_ai_requests").default(3),
  lastResetDate: timestamp("last_reset_date").default(sql`NOW()`),
});

// ===== ZONING SCHEMAS =====
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions)
  .pick({
    userId: true,
    tier: true,
  })
  .extend({
    tier: z.enum(["free", "pro", "premium"]),
  });

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  orderId: true,
  amount: true,
  type: true,
  itemId: true,
});

export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments).pick({
  userId: true,
  courseId: true,
});

// ===== TYPES =====
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InAppPurchase = typeof inAppPurchases.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
