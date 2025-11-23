import CustomError from "./Custom.error.js";

class AccessDeniedError extends CustomError {
  constructor(message) {
    super(message, 403);
  }
}

const throwAccessDeniedError = (message) => {
  throw new AccessDeniedError(`Access Denied - ${message}`);
};

export default throwAccessDeniedError;
