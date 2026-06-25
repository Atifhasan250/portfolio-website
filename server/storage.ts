import { getProjectsCollection, getContactsCollection } from './db.js';
import { ObjectId } from 'mongodb';

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
}

export const storage = new MongoStorage();
