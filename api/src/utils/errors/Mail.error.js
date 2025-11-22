import CustomError from "./Custom.error.js";

class MailError extends CustomError {
  constructor(message) {
    super(message, 500);
  }
}

const throwMailError = (message) => {
  throw new MailError(message);
};

export default throwMailError;
