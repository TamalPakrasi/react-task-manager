import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_URI } from "../env/env.js";

// schema validator
import validateSchema from "./validator.js";

// schema
import UsersSchema from "./Users.schema.js";
import TasksSchema from "./Tasks.schema.js";

export const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db = null;

const validations = {
  users: UsersSchema,
  tasks: TasksSchema,
};

export const connectDB = async () => {
  if (_db) return _db;
  try {
    await client.connect();

    console.log("MongoDB connected");

    _db = client.db("taskmanager");

    await Promise.all(
      Object.entries(validations).map(([collection, schema]) =>
        validateSchema(_db, collection, schema)
      )
    );

    await _db.collection("users").createIndex({ email: 1 }, { unique: true });

    return _db;
  } catch (error) {
    await client?.close();
    console.error("MongoDB connection error:", error);
  }
};

export const getCollection = (collection) => {
  return _db.collection(collection);
};
