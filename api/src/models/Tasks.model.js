import { ObjectId } from "mongodb";
import { getCollection } from "../config/db/conn.js";
import throwDBError from "../utils/errors/Database.error.js";

// create new task
export const create = async (payload) => {
  try {
    const Tasks = getCollection("tasks");

    payload.assignedTo = payload.assignedTo.map((id) => new ObjectId(id));

    const newTask = {
      ...payload,
      priority: payload.priority[0].toUpperCase() + payload.priority.slice(1),
      createdBy: new ObjectId(payload.createdBy),
      progress: 0,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await Tasks.insertOne(newTask);

    delete newTask.updatedAt;

    return { ...newTask, _id: res.insertedId };
  } catch (error) {
    throwDBError("Failed to create new tasks");
  }
};
