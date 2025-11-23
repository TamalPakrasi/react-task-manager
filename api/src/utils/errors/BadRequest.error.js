import CustomError from "./Custom.error.js";

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

const throwBadRequestError = (message) => {
  throw new BadRequestError(message);
};

export default throwBadRequestError;
