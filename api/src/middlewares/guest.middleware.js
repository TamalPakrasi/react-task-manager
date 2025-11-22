import { REFRESH_TOKEN_SECRET } from "../config/env/env.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import * as TokensModel from "../models/Tokens.model.js";
import throwAuthError from "../utils/errors/Auth.error.js";

const guest = async (req, res, next) => {
  try {
    if (!req.cookies) return await next();

    const { refresh_token } = req.cookies;

    // if referesh token not found then proceed
    if (!refresh_token) {
      return await next();
    }
    // verfiying jwt
    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    if (!decoded || !decoded.id) {
      return await next();
    }

    // verifying in the db
    const hashToken = await TokensModel.get(decoded.id);
    if (!hashToken || !hashToken.token) {
      return await next();
    }

    // verfiying hashing
    const match = await bcrypt.compare(refresh_token, hashToken.token);

    if (!match) {
      return await next();
    }

    throwAuthError("User is already authenticated", 403);
  } catch (error) {
    await next(error);
  }
};

export default guest;
