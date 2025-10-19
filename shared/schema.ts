import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const diagnostics = pgTable("diagnostics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certification: text("certification").notNull(),
  knowledgeLevel: text("knowledge_level").notNull(),
  learningStyle: text("learning_style").notNull(),
  studyStructure: text("study_structure").notNull(),
  focusAreas: text("focus_areas").array(),
  previousAttempts: text("previous_attempts").notNull(),
  failedDomains: text("failed_domains").array(),
  examDate: text("exam_date"),
  examTimeline: text("exam_timeline").notNull(),
  weeklyHours: text("weekly_hours").notNull(),
  studyTimes: text("study_times").notNull(),
  existingMaterials: text("existing_materials"),
  motivationPreferences: text("motivation_preferences"),
});

export const insertDiagnosticSchema = createInsertSchema(diagnostics).omit({
  id: true,
});

export type InsertDiagnostic = z.infer<typeof insertDiagnosticSchema>;
export type Diagnostic = typeof diagnostics.$inferSelect;

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey(),
  status: text("status").notNull().default("published"),
  type: text("type").notNull(),
  stem: text("stem").notNull(),
  options: jsonb("options").notNull(),
  explanation: jsonb("explanation").notNull(),
  domain: text("domain").notNull(),
  difficulty: integer("difficulty").notNull(),
  timeSuggestedSec: integer("time_suggested_sec").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  certificationName: text("certification_name").notNull(),
  mode: text("mode").notNull(),
  domains: text("domains").array().notNull(),
  blueprint: jsonb("blueprint").notNull(),
  questionCount: integer("question_count").notNull(),
  timer: jsonb("timer").notNull(),
  review: jsonb("review").notNull(),
  status: text("status").notNull().default("active"),
  index: integer("index").notNull().default(0),
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export const weekProgress = pgTable("week_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  weekNumber: integer("week_number").notNull(),
  status: text("status").notNull().default("locked"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  completedTopics: integer("completed_topics").notNull().default(0),
  totalTopics: integer("total_topics").notNull().default(0),
  timeSpent: integer("time_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWeekProgressSchema = createInsertSchema(weekProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWeekProgress = z.infer<typeof insertWeekProgressSchema>;
export type WeekProgress = typeof weekProgress.$inferSelect;

export const dayProgress = pgTable("day_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekProgressId: varchar("week_progress_id").notNull(),
  dayIndex: integer("day_index").notNull(),
  dayName: text("day_name").notNull(),
  status: text("status").notNull().default("locked"),
  unlockedAt: timestamp("unlocked_at"),
  completedAt: timestamp("completed_at"),
  completedActivities: jsonb("completed_activities").notNull().default(sql`'[]'::jsonb`),
  timeSpent: integer("time_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDayProgressSchema = createInsertSchema(dayProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDayProgress = z.infer<typeof insertDayProgressSchema>;
export type DayProgress = typeof dayProgress.$inferSelect;
