import { ObjectId } from "mongodb";
import { getCollection } from "../config/db/conn.js";
import throwDBError from "../utils/errors/Database.error.js";

// store refresh token
export const store = async ({ userId, token, expiresAt }) => {
  try {
    const RefreshTokens = getCollection("refreshTokens");

    await RefreshTokens.insertOne({
      userId: new ObjectId(userId),
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return;
  } catch (error) {
    console.log(error);
    throwDBError("Failed to store refresh token");
  }
};

// get hashed refresh token
export const get = async (userId) => {
  try {
    const RefreshTokens = getCollection("refreshTokens");

    const pipeline = [
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: { user: { $ne: [] } },
      },
      {
        $project: {
          _id: 0,
          token: 1,
        },
      },
    ];

    const res = await RefreshTokens.aggregate(pipeline).toArray();

    return res[0] || null;
  } catch (error) {
    throwDBError("Failed to retrieve refresh token");
  }
};

// delete a hashed token from db
export const revoke = async (userId) => {
  try {
    const RefreshTokens = getCollection("refreshTokens");

    const res = await RefreshTokens.deleteOne({ userId: new ObjectId(userId) });

    return res.deletedCount === 1;
  } catch (error) {
    throwDBError("Failed to log out User");
  }
};
