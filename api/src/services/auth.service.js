import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env/env.js";

import throwUploadError from "../utils/errors/Upload.error.js";
import throwAuthError from "../utils/errors/Auth.error.js";

import ValidationService from "./validation.service.js";
import UplaodService from "./Upload.service.js";

import * as UsersModel from "../models/Users.model.js";
import * as TokensModel from "../models/Tokens.model.js";

class Auth {
  #username = "";
  #email = "";
  #pass = "";
  #file = null;

  #profilePictureUrl = null;
  #profilePicturePublicId = null;

  #salt_rounds = 10;

  constructor({ username, email, password, file }) {
    this.#username = username;
    this.#email = email;
    this.#pass = password;
    this.#file = file;
  }

  #generateAccessToken(userID) {
    const token = jwt.sign({ id: userID }, ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
    if (!token) {
      throwAuthError("Failed to generate tokens", 500);
    }
    return token;
  }

  async #generateRefreshToken(userID) {
    const token = jwt.sign({ id: userID }, REFRESH_TOKEN_SECRET, {
      expiresIn: "14d",
    });

    if (!token) {
      throwAuthError("Failed to generate tokens", 500);
    }

    const hashToken = await this.#generateHashedPass(token);

    return {
      refresh_token: token,
      hashToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    };
  }

  async #generateHashedPass() {
    try {
      const hash = await bcrypt.hash(this.#pass, this.#salt_rounds);
      return hash;
    } catch (error) {
      throwAuthError("Failed to hash password", 500);
    }
  }

  async #checkEmailExists() {
    const user = await UsersModel.findUserByEmail(this.#email);
    return user;
  }

  async #login(userId) {
    const access_token = this.#generateAccessToken(userId);

    const { refresh_token, hashToken, expiresAt } =
      await this.#generateRefreshToken(userId);

    await TokensModel.store({
      userId,
      token: hashToken,
      expiresAt,
    });

    return {
      access_token: {
        token: access_token,
      },
      refresh_token: {
        token: refresh_token,
        expiry: expiresAt,
      },
    };
  }

  async #create() {
    const hashPass = await this.#generateHashedPass();

    const newUser = await UsersModel.create({
      username: this.#username,
      email: this.#email,
      password: hashPass,
      profileImageUrl: this.#profilePictureUrl,
      profileImagePublicId: this.#profilePicturePublicId,
    });

    return await this.#login(newUser.userId);
  }

  async register() {
    // credential validation
    ValidationService.validateRegistrationCredentials(
      this.#username,
      this.#email,
      this.#pass
    );

    // check email existance
    const user = await this.#checkEmailExists();

    // if user is present log in user
    if (user) {
      this.#login();
      return;
    }

    // if file exists file uploading
    if (this.#file) {
      const { buffer } = this.#file;

      try {
        const uploaded = await UplaodService.uploadToCloudinary(
          buffer,
          "task_manager/users"
        );

        this.#profilePictureUrl = uploaded.secure_url;
        this.#profilePicturePublicId = uploaded.public_id;
      } catch (error) {
        throwUploadError("Failed to upload profile picture", 500);
      }
    }

    // create new user
    return await this.#create();
  }
}

const auth = (info) => new Auth(info);

export default auth;
