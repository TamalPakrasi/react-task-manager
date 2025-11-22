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

  #user = null;

  #profilePictureUrl = null;
  #profilePicturePublicId = null;

  #salt_rounds = 10;

  constructor(obj) {
    const { username, email, password, file } = obj || {};

    this.#username = username || "";
    this.#email = email || "";
    this.#pass = password || "";
    this.#file = file || null;
  }

  #generateAccessToken() {
    const token = jwt.sign({ id: this.#user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    if (!token) {
      throwAuthError("Failed to generate tokens", 500);
    }
    return token;
  }

  async #generateRefreshToken() {
    const token = jwt.sign({ id: this.#user._id }, REFRESH_TOKEN_SECRET, {
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

  async #generateHashedPass(pass) {
    try {
      const hash = await bcrypt.hash(pass, this.#salt_rounds);
      return hash;
    } catch (error) {
      throwAuthError("Failed to hash password", 500);
    }
  }

  async #checkEmailExists() {
    const user = await UsersModel.findUserByEmail(this.#email);
    return user;
  }

  async #sendAuthToken() {
    if (!this.#user) return;
    const access_token = this.#generateAccessToken();

    const { refresh_token, hashToken, expiresAt } =
      await this.#generateRefreshToken();

    await TokensModel.store({
      userId: this.#user._id,
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
      user: this.#user,
    };
  }

  async #create() {
    const hashPass = await this.#generateHashedPass(this.#pass);

    const newUser = await UsersModel.create({
      username: this.#username,
      email: this.#email,
      password: hashPass,
      profileImageUrl: this.#profilePictureUrl,
      profileImagePublicId: this.#profilePicturePublicId,
    });

    this.#user = newUser;

    return await this.#sendAuthToken();
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
      throwAuthError("User Already Exists", 409);
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

  async login() {
    // credential validation
    ValidationService.validateLogInCredentials(this.#email, this.#pass);

    // check email existance
    const user = await this.#checkEmailExists();

    if (!user) {
      throwAuthError("User not found - Please Register", 404);
    }

    this.#user = user;

    return await this.#sendAuthToken();
  }

  async logout(userId) {
    const isLoggedOut = await TokensModel.revoke(userId);
    if (!isLoggedOut) {
      throwAuthError("Failed to Log out", 500);
    }
  }
}

const auth = (info) => new Auth(info);

export default auth;
