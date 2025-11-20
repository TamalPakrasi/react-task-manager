import CustomError from "./Custom.error.js";

class DatabaseError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}

const throwDBError = (message = "Failed to fetch data") => {
  throw new DatabaseError(message);
};

export default throwDBError;
