import { MongoClient, type Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in environment variables');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // uses the db name from the URI
  await ensureTelemetryIndexes(db);
  console.log('[MongoDB] Connected successfully');
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error('Database not connected. Call connectDB() first.');
  return db;
}

export function getProjectsCollection() {
  return getDB().collection('projects');
}

export function getContactsCollection() {
  return getDB().collection('contacts');
}

export function getAnalyticsCollection() {
  return getDB().collection('analytics_events');
}

export function getAuditLogsCollection() {
  return getDB().collection('audit_logs');
}

async function ensureTelemetryIndexes(database: Db): Promise<void> {
  const ttlSeconds = 90 * 24 * 60 * 60;
  await Promise.all([
    database.collection('analytics_events').createIndex({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds }),
    database.collection('analytics_events').createIndex({ type: 1, createdAt: -1 }),
    database.collection('analytics_events').createIndex({ sessionId: 1, createdAt: -1 }),
    database.collection('analytics_events').createIndex({ projectId: 1, createdAt: -1 }),
    database.collection('audit_logs').createIndex({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds }),
    database.collection('audit_logs').createIndex({ action: 1, outcome: 1, createdAt: -1 }),
    database.collection('audit_logs').createIndex({ actor: 1, createdAt: -1 }),
  ]);
}
