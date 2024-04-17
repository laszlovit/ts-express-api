import { MongoClient } from 'mongodb';

require('dotenv').config();

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST // Use test database URI when in test mode
    : process.env.MONGO_URI; // Use production database URI otherwise


if (!MONGO_URI) {
  throw new Error(
    'MongoDB connection URI is missing in the environment variables');
}

export const client = new MongoClient(MONGO_URI);
export const db = client.db();
