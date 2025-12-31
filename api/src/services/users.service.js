// models
import * as TasksModel from "../models/Tasks.model.js";
import * as UsersModel from "../models/Users.model.js";

import throwBadRequestError from "../utils/errors/BadRequest.error.js";

// other services
import validationService from "./Validation.service.js";

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

    validationService.validateUserId(id);

    return await UsersModel.findUserById(id);
  }

  async delete(id) {
    if (id === this.#userId) {
      throwBadRequestError("Deleting your own user ID is not permitted.");
    }

    validationService.validateUserId(id);

    await TasksModel.deleteMemberFromTasks(id);
    await UsersModel.deleteUser(id);
  }
}

const usersService = () => new Users();
export default usersService;
