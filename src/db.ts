import { MongoClient } from 'mongodb';


require('dotenv').config();

// Ensure the environment variable is loaded
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    'MongoDB connection URI is missing in the environment variables');
}

export const client = new MongoClient(MONGO_URI);
export const db = client.db();
