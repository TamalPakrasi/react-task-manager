import CustomError from "./Custom.error.js";

class UploadError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

const throwUploadError = (
  message = "Failed to upload File",
  statusCode = 500
) => {
  throw new UploadError(message, statusCode);
};

export default throwUploadError;
