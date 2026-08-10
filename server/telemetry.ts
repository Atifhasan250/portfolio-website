import { createHmac } from 'crypto';
import type { Request } from 'express';
import { storage, type NewAuditLog } from './storage.js';

export function normalizePath(value: string): string {
  try {
    const url = new URL(value, 'https://local.invalid');
    const path = url.pathname.replace(/\/{2,}/g, '/').slice(0, 240);
    return path.startsWith('/admin') ? '' : path || '/';
  } catch {
    return '';
  }
}

export function normalizeReferrer(value?: string): string {
  if (!value) return 'Direct';
  try {
    return new URL(value).hostname.replace(/^www\./, '').slice(0, 180) || 'Direct';
  } catch {
    return 'Direct';
  }
}

export function parseDevice(userAgent = ''): string {
  if (/bot|crawler|spider|crawling/i.test(userAgent)) return 'Bot';
  if (/ipad|tablet|kindle/i.test(userAgent)) return 'Tablet';
  if (/mobile|iphone|android/i.test(userAgent)) return 'Mobile';
  return userAgent ? 'Desktop' : 'Unknown';
}

export function isBot(userAgent = ''): boolean {
  return /bot|crawler|spider|crawling|headless|lighthouse|pagespeed/i.test(userAgent);
}

export function getCountry(req: Request): string {
  const value = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'];
  return (Array.isArray(value) ? value[0] : value || 'Unknown').toString().slice(0, 64);
}

function requestIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || req.ip || 'unknown';
}

export function hashRequestIp(req: Request): string {
  const secret = process.env.JWT_SECRET || 'development-audit-key';
  return createHmac('sha256', secret).update(`audit:${requestIp(req)}`).digest('hex').slice(0, 20);
}

export function adminActor(req: Request, fallback = 'unknown'): string {
  return String((req as any).admin?.username || fallback).slice(0, 100);
}

export async function writeAudit(req: Request, entry: Omit<NewAuditLog, 'ipHash' | 'device' | 'createdAt'>): Promise<void> {
  try {
    await storage.createAuditLog({
      ...entry,
      ipHash: hashRequestIp(req),
      device: parseDevice(req.get('user-agent') || ''),
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[Audit] Failed to persist audit entry', error);
  }
}

export function changedFields(body: Record<string, unknown>): string[] {
  const allowed = ['title', 'description', 'link', 'technologies', 'featured', 'order', 'image'];
  return Object.keys(body).filter(key => allowed.includes(key)).sort();
}

export function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}
