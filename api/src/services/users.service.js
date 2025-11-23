import bcrypt from "bcrypt";

// models
import * as TasksModel from "../models/Tasks.model.js";
import * as UsersModel from "../models/Users.model.js";

class Users {
  async getAll() {
    return await UsersModel.findMembers();
  }
}

const usersService = () => new Users();
export default usersService;
