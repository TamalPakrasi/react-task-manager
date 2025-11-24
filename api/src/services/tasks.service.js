// other services
import validationService from "./validation.service.js";

// models
import * as TasksModel from "../models/Tasks.model.js";

class Tasks {
  // #title = "";
  // #description = "";
  // #priority = "";
  // #dueDate = null;
  // #assignedTo = [];
  // #createdBy = null;
  // #attachments = [];
  // #taskCheckList = [];

  async create(payload) {
    validationService.validateTasksCredentials(payload);

    return await TasksModel.create({
      ...payload,
      dueDate: new Date(payload.dueDate),
    });
  }
}

const tasksService = () => new Tasks();

export default tasksService;
