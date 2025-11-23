import CustomError from "../utils/errors/Custom.error.js";

const error = (err, req, res) => {
  if (err instanceof CustomError) {
    return res?.sendJSON(err.statusCode, err.message);
  }

  return res?.sendJSON(500, "Internal Server Error");
};

export default error;
