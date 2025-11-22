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
        $project: {
          password: 0,
          updatedAt: 0,
        },
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
      {
        $project: {
          password: 0,
          updatedAt: 0,
        },
      },
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

    const user = { userId: res.insertedId, ...newUser };
    delete user.password;
    delete user.updatedAt;
    delete user._id;

    return user;
  } catch (error) {
    console.log(error);
    throwDBError("Failed to create new user");
  }
};
