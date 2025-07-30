import { MongoClient, Document } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;

export async function getCollection<T extends Document = Document>(name: string) {
  const conn = await clientPromise;
  const db = conn.db();
  return db.collection<T>(name);
}
