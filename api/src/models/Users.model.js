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
      { $unset: ["password", "updatedAt"] },
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
export const create = async ({
  username,
  email,
  password,
  profileImageUrl,
  profileImagePublicId,
}) => {
  try {
    const Users = getCollection("users");

    const newUser = {
      username,
      email,
      password,
      profileImageUrl,
      profileImagePublicId,
      role: "member",
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await Users.insertOne(newUser);

    delete newUser.password;
    delete newUser.updatedAt;

    return newUser;
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
                $expr: { $eq: ["$assignedTo", "$$userId"] },
              },
            },
            {
              $group: {
                _id: null,
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
  } catch (error) {
    throwDBError("Failed to delete user");
  }
};
