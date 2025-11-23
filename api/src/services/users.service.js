import bcrypt from "bcrypt";

// models
import * as TasksModel from "../models/Tasks.model.js";
import * as UsersModel from "../models/Users.model.js";
import throwBadRequestError from "../utils/errors/BadRequest.error.js";

class Users {
  #userId = null;

  constructor(userId = null) {
    this.#userId = userId;
  }

  async getAll() {
    return await UsersModel.findMembers();
  }

  async getOneById(id) {
    if (id === this.#userId) {
      throwBadRequestError("Searching your own user ID is not permitted.");
    }

    return await UsersModel.findUserById(id);
  }
}

const usersService = () => new Users();
export default usersService;
