import { ObjectId } from "mongodb";
import throwDBError from "../utils/errors/Database.error.js";
import { getCollection } from "../config/db/conn.js";

// checking user by _id
export const findUserById = async (id) => {
  try {
    const Users = getCollection("users");
    const pipeline = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $unset: ["password", "updatedAt"],
      },
      {
        $limit: 1,
      },
    ];

    const res = await Users.aggregate(pipeline).toArray();

    if (!res || res.length === 0) {
      throw new Error("Failed to fetch User Info");
    }

    return res[0];
  } catch (error) {
    throwDBError(error.message);
  }
};

// checking user by email
export const findUserByEmail = async (email) => {
  try {
    const Users = getCollection("users");
    const pipeline = [
      {
        $match: { email },
      },
      { $unset: ["updatedAt"] },
      {
        $limit: 1,
      },
    ];

    const res = await Users.aggregate(pipeline).toArray();

    return res[0] || null;
  } catch (error) {
    console.log(error);
    throwDBError("Something Went Wrong");
  }
};

// creating new user in db
export const create = async (payload) => {
  try {
    const Users = getCollection("users");

    const newUser = {
      ...payload,
      role: "member",
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await Users.insertOne(newUser);

    delete newUser.password;
    delete newUser.updatedAt;

    return { ...newUser, _id: res.insertedId };
  } catch (error) {
    console.log(error);
    throwDBError("Failed to create new user");
  }
};

// checking all users with role = member (non-admins)
export const findMembers = async () => {
  try {
    const Users = getCollection("users");

    const pipeline = [
      {
        $match: {
          role: { $eq: "member" },
        },
      },

      {
        $lookup: {
          from: "tasks",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$userId", "$assignedTo"] },
              },
            },
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
          ],
          as: "taskCounts",
        },
      },

      {
        $unwind: {
          path: "$taskCounts",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          allCount: "$taskCounts.all",
          pendingCount: { $ifNull: ["$taskCounts.pending", 0] },
          inProgressCount: { $ifNull: ["$taskCounts.inProgress", 0] },
          completedCount: { $ifNull: ["$taskCounts.completed", 0] },
        },
      },

      {
        $unset: ["password", "taskCounts", "updatedAt"],
      },
    ];

    const res = await Users.aggregate(pipeline).toArray();

    return res;
  } catch (error) {
    throwDBError("Failed to get users");
  }
};

// deleting existing user
export const deleteUser = async (id) => {
  try {
    const Users = getCollection("users");

    const res = await Users.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount === 0) {
      throw new Error("User Not Found");
    }
  } catch (error) {
    throwDBError(error.message || "Failed to delete user");
  }
};

// checking user existance
export const checkUsersExist = async (ids) => {
  try {
    const Users = getCollection("users");

    const objectIds = ids.map((id) => new ObjectId(id));

    const res = await Users.find({
      _id: { $in: objectIds },
    }).toArray();

    if (res.length !== ids.length) {
      throw new Error("One or more assigned users do not exist");
    }
  } catch (error) {
    throwDBError(error.message);
  }
};
