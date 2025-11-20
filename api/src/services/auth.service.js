import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env/env.js";

import throwUploadError from "../utils/errors/Upload.error.js";

import ValidationService from "./validation.service.js";
import UplaodService from "./Upload.service.js";

import * as UsersModel from "../models/Users.model.js";

class Auth {
  #username = "";
  #email = "";
  #pass = "";
  #file = null;

  #profilePictureUrl = null;
  #profilePicturePublicId = null;

  #user = null;

  #salt_rounds = 10;

  constructor({ username, email, password, file }) {
    this.#username = username;
    this.#email = email;
    this.#pass = password;
    this.#file = file;
  }

  #generateAccessToken(userID) {
    return jwt.sign({ id: userID }, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
  }

  #generateRefreshToken(userID) {
    return jwt.sign({ id: userID }, REFRESH_TOKEN_SECRET, { expiresIn: "14d" });
  }

  async #generateHashedPass() {
    try {
      const hash = await bcrypt.hash(this.#pass, this.#salt_rounds);
      return hash;
    } catch (error) {
      throw new Error("Failed to hash password");
    }
  }

  async #checkEmailExists() {
    const user = await UsersModel.findUserByEmail(this.#email);
    return user;
  }

  async #login() {
    return this.#user;
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

    this.#user = newUser;

    this.#login();
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
      this.#user = user;
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
    await this.#create();

    return this.#user;
  }
}

const auth = (info) => new Auth(info);

export default auth;
