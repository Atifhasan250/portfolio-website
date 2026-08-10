// Shared types and Zod schemas for MongoDB-backed data
// (No Drizzle/Postgres — all data lives in MongoDB)
import { z } from 'zod';

// ─── Project ──────────────────────────────────────────────────────────────────

export const insertProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional().default(''),
  imagekitFileId: z.string().optional().default(''),
  link: z.string().url('Must be a valid URL'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  featured: z.boolean().optional().default(false),
  order: z.number().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagekitFileId: string;
  link: string;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export const insertContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Must be a valid email').max(254, 'Email is too long'),
  subject: z.string().trim().min(1, 'Subject is required').max(150, 'Subject is too long'),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
});

export type InsertContact = z.infer<typeof insertContactSchema>;

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// Analytics is intentionally session-only: no persistent visitor id or raw IP.
export const analyticsEventSchema = z.object({
  type: z.enum(['page_view', 'project_click']),
  sessionId: z.string().regex(/^[a-zA-Z0-9_-]{16,80}$/),
  path: z.string().trim().min(1).max(240),
  referrer: z.string().trim().max(180).optional().default('Direct'),
  projectId: z.string().trim().max(80).optional(),
  projectLabel: z.string().trim().max(120).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
}).strict().superRefine((event, ctx) => {
  if (event.type === 'project_click' && !event.projectId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['projectId'], message: 'projectId is required for project clicks' });
  }
});

export const analyticsBatchSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(20),
}).strict();

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

export interface AnalyticsMetric {
  current: number;
  previous: number;
  delta: number | null;
}

export interface AnalyticsSummary {
  range: 7 | 30 | 90;
  generatedAt: string;
  metrics: {
    pageViews: AnalyticsMetric;
    sessions: AnalyticsMetric;
    projectClicks: AnalyticsMetric;
    contacts: AnalyticsMetric;
    conversionRate: AnalyticsMetric;
  };
  trend: Array<{ date: string; pageViews: number; sessions: number; projectClicks: number; contacts: number }>;
  topProjects: Array<{ projectId: string; label: string; value: number }>;
  sources: Array<{ label: string; value: number }>;
  devices: Array<{ label: string; value: number }>;
  countries: Array<{ label: string; value: number }>;
}

export const auditActions = [
  'auth.login', 'auth.login_failed', 'auth.logout',
  'project.create', 'project.update', 'project.delete', 'project.reorder', 'project.image_replace',
  'audit.export',
] as const;

export type AuditAction = typeof auditActions[number];
export type AuditOutcome = 'success' | 'failure';

export interface AuditLog {
  _id: string;
  actor: string;
  action: AuditAction;
  outcome: AuditOutcome;
  targetType: string;
  targetId?: string;
  targetLabel?: string;
  changedFields: string[];
  ipHash: string;
  device: string;
  message?: string;
  createdAt: string;
}

export interface PaginatedAuditLogs {
  items: AuditLog[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ─── Legacy User type (kept for compatibility) ────────────────────────────────
export interface User {
  id: string;
  username: string;
  password: string;
}

export type InsertUser = Pick<User, 'username' | 'password'>;
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
