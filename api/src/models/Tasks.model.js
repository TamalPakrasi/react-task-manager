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

// finding tasks
export const find = async ({ status, assignedTo = null }) => {
  try {
    const Tasks = getCollection("tasks");

    const oid = new ObjectId(assignedTo);

    const pipeline = [];

    if (assignedTo && ObjectId.isValid(assignedTo)) {
      pipeline.push({
        $match: {
          assignedTo: { $in: [oid] },
        },
      });
    }

    if (status) {
      pipeline.push({
        $match: {
          status: { $eq: status },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [{ $project: { username: 1, email: 1, profileImageUrl: 1 } }],
      },
    });

    const res = await Tasks.aggregate(pipeline).toArray();

    return res;
  } catch (error) {
    console.error(error);
    throwDBError("Failed To Fetch Tasks");
  }
};

// counting
export const count = async ({ role, assignedTo }) => {
  try {
    const Tasks = getCollection("tasks");

    const pipeline = [];

    if (role === "member") {
      pipeline.push({
        $match: {
          assignedTo: { $in: [new ObjectId(assignedTo)] },
        },
      });
    }

    pipeline.push(
      ...[
        {
          $group: {
            _id: null,
            all: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
            },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
          },
        },
        {
          $unset: ["_id"],
        },
      ]
    );

    const res = await Tasks.aggregate(pipeline).toArray();

    return res[0] || { all: 0, pending: 0, inProgress: 0, completed: 0 };
  } catch (error) {
    throwDBError("Failed to count Tasks");
  }
};

// finding by id
export const findById = async (id) => {
  try {
    const Tasks = getCollection("tasks");

    const pipeline = [
      {
        $match: {
          _id: { $eq: new ObjectId(id) },
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
          pipeline: [
            { $project: { username: 1, email: 1, profileImageUrl: 1 } },
          ],
        },
      },
    ];

    const res = await Tasks.aggregate(pipeline).toArray();

    return res[0] || null;
  } catch (error) {
    throwDBError("Failed To Fetch task By Id");
  }
};
