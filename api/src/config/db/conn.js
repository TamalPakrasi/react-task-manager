import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_URI } from "../env/env.js";

export const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db = null;

export const connectDB = async () => {
  if (_db) return _db;
  try {
    await client.connect();

    console.log("MongoDB connected");

    _db = client.db("taskmanager");

    return _db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export const getDB = () => {
  if (!_db) {
    throw new Error("Database not initialized.");
  }
  return _db;
};
