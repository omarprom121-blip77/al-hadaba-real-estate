import { ObjectId } from 'mongodb';
import db from './db';

const collection = async () => (await db).db(process.env.MONGODB_DB).collection('content');

const serialize = (item) => item ? { ...item, _id: item._id.toString(), id: item._id.toString() } : null;

export async function getPublishedContent(kind) {
  const items = await (await collection()).find({ type: kind, published: true }).sort({ createdAt: -1 }).toArray();
  return items.map(serialize);
}

export async function getPublishedProject(id) {
  if (!id || !ObjectId.isValid(id)) return null;
  const item = await (await collection()).findOne({ _id: new ObjectId(id), type: 'projects', published: true });
  return serialize(item);
}
