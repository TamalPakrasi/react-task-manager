import CustomError from "./Custom.error.js";

class ValidationError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

const throwValidationError = (message = "Invalid Credentials") => {
  throw new ValidationError(message, 400);
};

export default throwValidationError;
