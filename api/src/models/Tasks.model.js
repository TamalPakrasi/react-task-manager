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

// update tasks
export const update = async ({ id, payload }) => {
  try {
    const Tasks = getCollection("tasks");

    if ("assignedTo" in payload) {
      payload.assignedTo = payload.assignedTo.map((id) => new ObjectId(id));
    }

    const res = await Tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );

    return res.matchedCount > 0 && res.modifiedCount > 0;
  } catch (error) {
    throwDBError("Failed To Update Task");
  }
};

// delete tasks
export const deleteTask = async (id) => {
  try {
    const Tasks = await getCollection("tasks");

    const res = await Tasks.deleteOne({ _id: new ObjectId(id) });

    return res.deletedCount > 0;
  } catch (error) {
    await next(error);
  }
};

// updating task status and progress
export const updateStatusAndProgress = async ({
  id,
  assignedTo,
  status,
  progress,
  updatedAt,
}) => {
  try {
    const Tasks = getCollection("tasks");

    const filter = {
      _id: { $eq: new ObjectId(id) },
    };

    if (assignedTo) {
      filter.assignedTo = { $in: [new ObjectId(assignedTo)] };
    }

    const res = await Tasks.updateOne(filter, [
      {
        $set: {
          status,
          progress,
          updatedAt,
        },
      },
      {
        $set: {
          taskCheckList: {
            $cond: [
              { $eq: ["$progress", 100] },
              {
                $map: {
                  input: "$taskCheckList",
                  as: "item",
                  in: {
                    $mergeObjects: ["$$item", { completed: true }],
                  },
                },
              },
              {
                $map: {
                  input: "$taskCheckList",
                  as: "item",
                  in: {
                    $mergeObjects: ["$$item", { completed: false }],
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    return res.matchedCount > 0 && res.modifiedCount > 0;
  } catch (error) {
    console.dir(error, { depth: null });
    throwDBError("Failed to update status");
  }
};

// updating task checklist and progress
export const updateTaskCheckListAndProgress = async ({
  id,
  assignedTo,
  taskCheckList,
  updatedAt,
}) => {
  try {
    const Tasks = getCollection("tasks");

    const filter = {
      _id: { $eq: new ObjectId(id) },
    };

    if (assignedTo) {
      filter.assignedTo = { $in: [new ObjectId(assignedTo)] };
    }

    const updateProgress = {
      $round: [
        {
          $multiply: [
            {
              $divide: [
                {
                  $size: {
                    $filter: {
                      input: "$taskCheckList",
                      as: "item",
                      cond: {
                        $eq: ["$$item.completed", true],
                      },
                    },
                  },
                },
                { $size: "$taskCheckList" },
              ],
            },
            100,
          ],
        },
      ],
    };

    const res = await Tasks.updateOne(filter, [
      {
        $set: {
          taskCheckList,
          updatedAt,
        },
      },
      {
        $set: {
          progress: {
            $cond: [
              { $gt: [{ $size: "$taskCheckList" }, 0] },
              updateProgress,
              0,
            ],
          },
        },
      },
      {
        $set: {
          status: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$progress", 100],
                  },
                  then: "Completed",
                },
                {
                  case: {
                    $gt: ["$progress", 0],
                  },
                  then: "In Progress",
                },
              ],
              default: "Pending",
            },
          },
        },
      },
    ]);

    return res.matchedCount > 0 && res.modifiedCount > 0;
  } catch (error) {
    throwDBError("Failed to update task checklist");
  }
};

// getting statistics
export const getStats = async (assignedTo) => {
  try {
    const Tasks = getCollection("tasks");

    const pipeline = [];

    if (assignedTo) {
      pipeline.push({
        $match: { assignedTo: { $in: [new ObjectId(assignedTo)] } },
      });
    }

    pipeline.push(
      ...[
        {
          $group: {
            _id: null,
            overDueTasks: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$status", "Completed"] },
                      { $lt: ["$dueDate", new Date()] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
            inProgressTasks: {
              $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
            },
            pendingTasks: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
            },
            lowPriority: {
              $sum: { $cond: [{ $eq: ["$priority", "Low"] }, 1, 0] },
            },
            mediumPriority: {
              $sum: { $cond: [{ $eq: ["$priority", "Medium"] }, 1, 0] },
            },
            highPriority: {
              $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            overDueTasks: 1,
            status: {
              all: "$totalTasks",
              Completed: "$completedTasks",
              "In Progress": "$inProgressTasks",
              Pending: "$pendingTasks",
            },
            priority: {
              Low: "$lowPriority",
              Medium: "$mediumPriority",
              High: "$highPriority",
            },
          },
        },
      ]
    );

    const res = await Tasks.aggregate(pipeline).toArray();

    return (
      res[0] || {
        overDueTasks: 0,
        status: {
          all: 0,
          Pending: 0,
          "In Progress": 0,
          Completed: 0,
        },
        priority: {
          Low: 0,
          Medium: 0,
          High: 0,
        },
      }
    );
  } catch (error) {
    throwDBError("Failed To Fetch Statistics");
  }
};

// getting lastest tasks
export const getLatest = async (limit = 10, assignedTo) => {
  try {
    const Tasks = getCollection("tasks");

    const pipeline = [];

    if (assignedTo) {
      pipeline.push({
        $match: { assignedTo: { $in: [new ObjectId(assignedTo)] } },
      });
    }

    pipeline.push(
      ...[
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            title: 1,
            status: 1,
            priority: 1,
            dueDate: 1,
            createdAt: 1,
          },
        },
      ]
    );

    const res = await Tasks.aggregate(pipeline).toArray();

    return res || null;
  } catch (error) {
    throwDBError("Failed To Fetch Latest Posts");
  }
};

// deleting user from assigned to
export const deleteMemberFromTasks = async (assignedTo) => {
  try {
    const Tasks = getCollection("tasks");

    await Tasks.updateMany(
      { assignedTo: new ObjectId(assignedTo) },
      { $pull: { assignedTo: new ObjectId(assignedTo) } }
    );
  } catch (error) {
    throwDBError("Failed to delete user from tasks");
  }
};
