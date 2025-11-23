import { REFRESH_TOKEN_SECRET } from "../config/env/env.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import * as TokensModel from "../models/Tokens.model.js";
import throwAccessDeniedError from "../utils/errors/AccessDenied.error.js";

const hasRefreshToken = async (req, res, next) => {
  try {
    if (!req.cookies)
      throwAccessDeniedError("Only Logged In Members Can Access This");

    const { refresh_token } = req.cookies;

    // if referesh token not found then don't proceed
    if (!refresh_token) {
      throwAccessDeniedError("Only Logged In Members Can Access This");
    }

    // verfiying jwt
    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);

    if (!decoded || !decoded.id) {
      throwAccessDeniedError("Only Logged In Members Can Access This");
    }

    // verifying in the db
    const hashToken = await TokensModel.get(decoded.id);
    if (!hashToken || !hashToken.token) {
      throwAccessDeniedError("Only Logged In Members Can Access This");
    }

    // verfiying hashing
    const match = await bcrypt.compare(refresh_token, hashToken.token);

    if (!match) {
      throwAccessDeniedError("Only Logged In Members Can Access This");
    }

    req.user = { id: decoded.id };

    await next();
  } catch (error) {
    await next(error);
  }
};

export default hasRefreshToken;
