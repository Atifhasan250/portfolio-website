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
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
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
