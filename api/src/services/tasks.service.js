// other services
import validationService from "./validation.service.js";

// models
import * as TasksModel from "../models/Tasks.model.js";
import * as UsersModel from "../models/Users.model.js";
import throwBadRequestError from "../utils/errors/BadRequest.error.js";

class Tasks {
  #getFormatedStatus(sts) {
    let status = null;

    const possibleStatuses = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
    };

    if (sts in possibleStatuses) {
      status = possibleStatuses[sts];
    }

    return status;
  }

  async getAll({ assignedTo, role, sts = null }) {
    const status = this.#getFormatedStatus(sts);

    let tasks;

    if (role === "admin") {
      tasks = await TasksModel.find({ status });
    } else {
      tasks = await TasksModel.find({ status, assignedTo });
    }

    const statusSummary = await TasksModel.count({
      role: role === "admin" ? null : "member",
      assignedTo,
    });

    return [{ tasks: tasks }, { statusSummary: statusSummary }];
  }

  async create(payload) {
    validationService.validateTasksCredentials(payload);

    await UsersModel.checkUsersExist(payload.assignedTo);

    return await TasksModel.create({
      ...payload,
      dueDate: new Date(payload.dueDate),
    });
  }

  async getById(id) {
    validationService.validateUserId(id);

    const res = await TasksModel.findById(id);

    if (!res) {
      throwBadRequestError(`No Task With Id ($id) Is Found`);
    }

    return res;
  }

  async update(id, payload) {
    validationService.validateUserId(id);

    validationService.validateUpdatedTasks(payload);

    if ("priority" in payload) {
      payload.priority =
        payload.priority[0].toUpperCase() + payload.priority.slice(1);
    }

    const isUpdated = await TasksModel.update({
      id,
      payload: { ...payload, updatedAt: new Date() },
    });

    if (!isUpdated) {
      throwBadRequestError(`Tasks With Id (${id}) Does Not Exist`);
    }

    const res = await TasksModel.findById(id);

    return res;
  }

  async delete(id) {
    validationService.validateUserId(id);

    const res = await TasksModel.deleteTask(id);

    if (!res) {
      throwBadRequestError(`Tasks With Id (${id}) Does Not Exist`);
    }
  }
}

const tasksService = () => new Tasks();

export default tasksService;
