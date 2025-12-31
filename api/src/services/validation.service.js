import throwValidationError from "../utils/errors/Validation.error.js";
import { ObjectId } from "mongodb";

class Validation {
  static validateRegistrationCredentials(username, email, pass) {
    const errors = [];

    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(username)) {
      errors.push("Invalid Username");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push("Invalid Email");
    }

    if (!pass || !pass.trim()) {
      errors.push("Invalid Password");
    }

    if (errors.length > 0) {
      throwValidationError(errors.join(", "));
    }
  }

  static validateLogInCredentials(email, pass) {
    const errors = [];

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push("Invalid Email");
    }

    if (!pass || !pass.trim()) {
      errors.push("Invalid Password");
    }

    if (errors.length > 0) {
      throwValidationError(errors.join(", "));
    }
  }

  static validateUserId(id) {
    if (!ObjectId.isValid(id)) {
      throwValidationError("Invalid User Id");
    }
  }

  static validateTasksCredentials(obj) {
    const errors = [];
    const date = new Date(obj?.dueDate);

    if (!Array.isArray(obj?.assignedTo))
      errors.push("Assigned To Must Be An Array");

    for (const id of obj.assignedTo) {
      if (!ObjectId.isValid(id)) {
        errors.push("Invalid Assign Id");
        break;
      }
    }

    if (typeof obj?.title.trim() !== "string" && obj?.title.trim().length > 0)
      errors.push("Invalid Title");

    if (
      typeof obj?.description.trim() !== "string" &&
      obj?.description.trim().length > 0
    )
      errors.push("Invalid Description");

    if (!["low", "medium", "high"].includes(obj?.priority))
      errors.push("Invalid Priority");

    if (isNaN(date.getTime())) errors.push("Invalid Due Date");

    if (obj?.attachments !== null && !Array.isArray(obj?.attachments))
      errors.push("Attachments Must Be An Array Or NULL");

    if (obj?.taskCheckList !== null && !Array.isArray(obj?.taskCheckList))
      errors.push("Task Checklist Must Be An Array Or NULL");

    if (errors.length > 0) throwValidationError(errors.join(", "));
  }

  static validateUpdatedTasks(obj) {
    const errors = [];

    if ("title" in obj) {
      if (typeof obj.title.trim() !== "string" && obj.title.trim().length > 0) {
        errors.push("Invalid Title");
      }
    }

    if ("description" in obj) {
      if (
        typeof obj.description.trim() !== "string" &&
        obj.description.trim().length > 0
      )
        errors.push("Invalid Description");
    }

    if ("priority" in obj) {
      if (!["low", "medium", "high"].includes(obj.priority))
        errors.push("Invalid Priority");
    }

    if ("dueDate" in obj) {
      const date = new Date(obj.dueDate);
      if (isNaN(date.getTime())) errors.push("Invalid Due Date");
    }

    if ("taskCheckList" in obj) {
      if (obj.taskCheckList !== null && !Array.isArray(obj.taskCheckList))
        errors.push("Task Checklist Must Be An Array Or NULL");
    }

    if ("attachments" in obj) {
      if (obj.attachments !== null && !Array.isArray(obj.attachments))
        errors.push("Attachments Must Be An Array Or NULL");
    }

    if ("assignedTo" in obj) {
      if (!Array.isArray(obj.assignedTo))
        errors.push("Assigned To Must Be An Array");

      for (const assignedTo of obj.assignedTo) {
        if (!ObjectId.isValid(assignedTo)) {
          throwValidationError("Invalid User Id");
        }
      }
    }
  }
}

export default Validation;
