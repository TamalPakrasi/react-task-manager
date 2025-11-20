import CustomError from "./Custom.error.js";

class AuthError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

const throwAuthError = (
  message = "Unauthorized - Token Not Found",
  statusCode = 401
) => {
  throw new AuthError(message, statusCode);
};

export default throwAuthError;
