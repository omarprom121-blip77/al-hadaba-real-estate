import {MongoClient } from 'mongodb';

function getMongoPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoPromise) global._mongoPromise = new MongoClient(uri).connect();
    return global._mongoPromise;
  }

  return new MongoClient(uri).connect();
}

// Keep environment validation request-time so Next.js can build route handlers.
const db = new Proxy({}, {
  get(_, property) {
    if (property === 'then') return (resolve, reject) => getMongoPromise().then(resolve, reject);
    return undefined;
  }
});

export default db;
