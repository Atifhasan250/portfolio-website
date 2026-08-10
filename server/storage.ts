import { getProjectsCollection, getContactsCollection, getAnalyticsCollection, getAuditLogsCollection } from './db.js';
import { ObjectId } from 'mongodb';
import type { AnalyticsSummary, AuditAction, AuditOutcome, PaginatedAuditLogs } from '../shared/schema.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  _id?: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  imagekitFileId: string;
  link: string;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
}

export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface InsertProject {
  title: string;
  description: string;
  imageUrl?: string;
  imagekitFileId?: string;
  link: string;
  technologies: string[];
  featured?: boolean;
  order?: number;
}

export interface InsertContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface StoredAnalyticsEvent {
  type: 'page_view' | 'project_click' | 'contact_submit';
  sessionId: string;
  path: string;
  referrer: string;
  projectId?: string;
  projectLabel?: string;
  utmSource?: string;
  utmCampaign?: string;
  device: string;
  country: string;
  createdAt: Date;
}

export interface NewAuditLog {
  actor: string;
  action: AuditAction;
  outcome: AuditOutcome;
  targetType: string;
  targetId?: string;
  targetLabel?: string;
  changedFields?: string[];
  ipHash: string;
  device: string;
  message?: string;
  createdAt: Date;
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  action?: AuditAction;
  outcome?: AuditOutcome;
  search?: string;
  from?: Date;
  to?: Date;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export class MongoStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    const col = getProjectsCollection();
    return col.find({}).sort({ order: 1 }).toArray() as Promise<Project[]>;
  }

  async getProject(id: string): Promise<Project | null> {
    const col = getProjectsCollection();
    return col.findOne({ _id: new ObjectId(id) }) as Promise<Project | null>;
  }

  async createProject(data: InsertProject): Promise<Project> {
    const col = getProjectsCollection();
    const count = await col.countDocuments();
    const project: Omit<Project, '_id'> = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || '',
      imagekitFileId: data.imagekitFileId || '',
      link: data.link,
      technologies: data.technologies,
      featured: data.featured ?? false,
      order: data.order ?? count + 1,
      createdAt: new Date(),
    };
    const result = await col.insertOne(project);
    return { ...project, _id: result.insertedId };
  }

  async updateProject(id: string, data: Partial<InsertProject> & { imageUrl?: string; imagekitFileId?: string }): Promise<Project | null> {
    const col = getProjectsCollection();
    const update: Record<string, any> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.imageUrl !== undefined) update.imageUrl = data.imageUrl;
    if (data.imagekitFileId !== undefined) update.imagekitFileId = data.imagekitFileId;
    if (data.link !== undefined) update.link = data.link;
    if (data.technologies !== undefined) update.technologies = data.technologies;
    if (data.featured !== undefined) update.featured = data.featured;
    if (data.order !== undefined) update.order = data.order;

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    return result as Project | null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const col = getProjectsCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async reorderProjects(orderedIds: string[]): Promise<void> {
    const col = getProjectsCollection();
    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));
    if (ops.length > 0) await col.bulkWrite(ops);
  }

  // Contacts
  async createContact(data: InsertContact): Promise<Contact> {
    const col = getContactsCollection();
    const contact: Omit<Contact, '_id'> = { ...data, createdAt: new Date() };
    const result = await col.insertOne(contact);
    return { ...contact, _id: result.insertedId };
  }

  async getContacts(): Promise<Contact[]> {
    const col = getContactsCollection();
    return col.find({}).sort({ createdAt: -1 }).toArray() as Promise<Contact[]>;
  }

  // Analytics
  async createAnalyticsEvents(events: StoredAnalyticsEvent[]): Promise<void> {
    if (events.length) await getAnalyticsCollection().insertMany(events);
  }

  async getAnalyticsSummary(days: 7 | 30 | 90, timezone: string): Promise<AnalyticsSummary> {
    const col = getAnalyticsCollection();
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);
    const previousStart = new Date(start.getTime() - days * 86400000);

    const summarize = async (from: Date, to: Date) => {
      const match = { createdAt: { $gte: from, $lt: to } };
      const [counts, sessions] = await Promise.all([
        col.aggregate<{ _id: string; count: number }>([
          { $match: match },
          { $group: { _id: '$type', count: { $sum: 1 } } },
        ]).toArray(),
        col.distinct('sessionId', match),
      ]);
      const map = Object.fromEntries(counts.map(item => [item._id, item.count]));
      return {
        pageViews: map.page_view || 0,
        sessions: sessions.filter(Boolean).length,
        projectClicks: map.project_click || 0,
        contacts: map.contact_submit || 0,
      };
    };

    const [current, previous, trendRows, topProjects, sources, devices, countries] = await Promise.all([
      summarize(start, end),
      summarize(previousStart, start),
      col.aggregate<any>([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        { $group: {
          _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d', timezone } },
          pageViews: { $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] } },
          projectClicks: { $sum: { $cond: [{ $eq: ['$type', 'project_click'] }, 1, 0] } },
          contacts: { $sum: { $cond: [{ $eq: ['$type', 'contact_submit'] }, 1, 0] } },
          sessions: { $addToSet: '$sessionId' },
        } },
        { $project: { _id: 0, date: '$_id', pageViews: 1, projectClicks: 1, contacts: 1, sessions: { $size: '$sessions' } } },
        { $sort: { date: 1 } },
      ]).toArray(),
      this.aggregateBreakdown('projectId', start, { type: 'project_click' }, '$projectLabel'),
      this.aggregateBreakdown('referrer', start, { type: 'page_view' }),
      this.aggregateBreakdown('device', start, { type: 'page_view' }),
      this.aggregateBreakdown('country', start, { type: 'page_view' }),
    ]);

    const conversion = (value: typeof current) => value.sessions ? Number(((value.contacts / value.sessions) * 100).toFixed(1)) : 0;
    const metric = (now: number, before: number) => ({
      current: now,
      previous: before,
      delta: before === 0 ? (now === 0 ? 0 : null) : Number((((now - before) / before) * 100).toFixed(1)),
    });

    return {
      range: days,
      generatedAt: end.toISOString(),
      metrics: {
        pageViews: metric(current.pageViews, previous.pageViews),
        sessions: metric(current.sessions, previous.sessions),
        projectClicks: metric(current.projectClicks, previous.projectClicks),
        contacts: metric(current.contacts, previous.contacts),
        conversionRate: metric(conversion(current), conversion(previous)),
      },
      trend: trendRows,
      topProjects: topProjects.map((row: any) => ({ projectId: row.key, label: row.label || 'Untitled project', value: row.value })),
      sources: sources.map((row: any) => ({ label: row.key || 'Direct', value: row.value })),
      devices: devices.map((row: any) => ({ label: row.key || 'Unknown', value: row.value })),
      countries: countries.map((row: any) => ({ label: row.key || 'Unknown', value: row.value })),
    };
  }

  private async aggregateBreakdown(field: string, start: Date, extraMatch: Record<string, unknown>, labelExpression?: string) {
    return getAnalyticsCollection().aggregate<any>([
      { $match: { createdAt: { $gte: start }, ...extraMatch, [field]: { $nin: [null, ''] } } },
      { $group: { _id: `$${field}`, value: { $sum: 1 }, label: labelExpression ? { $first: labelExpression } : { $first: `$${field}` } } },
      { $project: { _id: 0, key: '$_id', label: 1, value: 1 } },
      { $sort: { value: -1 } },
      { $limit: 8 },
    ]).toArray();
  }

  // Audit logs
  async createAuditLog(entry: NewAuditLog): Promise<void> {
    await getAuditLogsCollection().insertOne(entry);
  }

  async getAuditLogs(filters: AuditLogFilters): Promise<PaginatedAuditLogs> {
    const query = this.buildAuditQuery(filters);
    const col = getAuditLogsCollection();
    const [items, total] = await Promise.all([
      col.find(query).sort({ createdAt: -1 }).skip((filters.page - 1) * filters.limit).limit(filters.limit).toArray(),
      col.countDocuments(query),
    ]);
    return {
      items: items.map(({ _id, ...item }) => ({ ...item, _id: _id.toString(), createdAt: item.createdAt.toISOString() })) as any,
      page: filters.page,
      limit: filters.limit,
      total,
      pages: Math.max(1, Math.ceil(total / filters.limit)),
    };
  }

  async exportAuditLogs(filters: Omit<AuditLogFilters, 'page' | 'limit'>) {
    const query = this.buildAuditQuery({ ...filters, page: 1, limit: 10000 });
    return getAuditLogsCollection().find(query).sort({ createdAt: -1 }).limit(10000).toArray();
  }

  private buildAuditQuery(filters: AuditLogFilters): Record<string, any> {
    const query: Record<string, any> = {};
    if (filters.action) query.action = filters.action;
    if (filters.outcome) query.outcome = filters.outcome;
    if (filters.from || filters.to) query.createdAt = { ...(filters.from && { $gte: filters.from }), ...(filters.to && { $lte: filters.to }) };
    if (filters.search) {
      const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'i');
      query.$or = [{ actor: pattern }, { targetLabel: pattern }, { targetId: pattern }, { message: pattern }];
    }
    return query;
  }
}

export const storage = new MongoStorage();
