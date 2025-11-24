import CustomError from "./Custom.error.js";

class TasksError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

const throwTasksError = (message, statusCode) => {
  throw new TasksError();
};

export default throwTasksError;
