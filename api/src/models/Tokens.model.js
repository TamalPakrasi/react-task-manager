import { ObjectId } from "mongodb";
import { getCollection } from "../config/db/conn.js";
import throwDBError from "../utils/errors/Database.error.js";

// store refresh tokens
export const store = async ({ userId, token, expiresAt }) => {
  try {
    const RefreshTokens = getCollection("refreshTokens");

    await RefreshTokens.insertOne({
      userId: new ObjectId(userId),
      token,
      expiresAt,
      createdAt: new Date(),
    });
    return;
  } catch (error) {
    console.log(error);
    throwDBError("Failed to store refresh token");
  }
};
