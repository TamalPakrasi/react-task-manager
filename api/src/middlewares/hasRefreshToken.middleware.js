import { REFRESH_TOKEN_SECRET } from "../config/env/env.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import * as TokensModel from "../models/Tokens.model.js";
import throwAuthError from "../utils/errors/Auth.error.js";

const hasRefreshToken = async (req, res, next) => {
  try {
    if (!req.cookies) throwAuthError("Forbidden - Log in first", 403);

    const { refresh_token } = req.cookies;

    // if referesh token not found then don't proceed
    if (!refresh_token) {
      throwAuthError("Forbidden - Log in first", 403);
    }

    // verfiying jwt
    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    if (!decoded || !decoded.id) {
      throwAuthError("Forbidden - Log in first", 403);
    }

    // verifying in the db
    const hashToken = await TokensModel.get(decoded.id);
    if (!hashToken || !hashToken.token) {
      throwAuthError("Forbidden - Log in first", 403);
    }

    // verfiying hashing
    const match = await bcrypt.compare(refresh_token, hashToken.token);

    if (!match) {
      throwAuthError("Forbidden - Log in first", 403);
    }

    req.user = { id: decoded.id };

    await next();
  } catch (error) {
    await next(error);
  }
};

export default hasRefreshToken;
