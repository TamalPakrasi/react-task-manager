import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env/env.js";
import throwAuthError from "../utils/errors/Auth.error.js";

import * as UsersModel from "../models/Users.model.js";

const authProtect = async (req, res, next) => {
  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer")
    ? authHeader.replace("Bearer", "").trim()
    : null; // Expect: "Bearer <token>"

  try {
    if (!token) {
      throwAuthError("Unauthorized - token not found", 401);
    }

    // verfiying jwt
    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      throwAuthError("Unauthorized - Invalid or expired token", 401);
    }

    if (!decoded?.id) {
      throwAuthError("Unauthorized - Invalid or expired token", 401);
    }

    const { id } = decoded;

    const user = await UsersModel.findUserById(id);

    req.user = user;

    await next();
  } catch (error) {
    await next(error);
  }
};

export default authProtect;
