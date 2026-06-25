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
