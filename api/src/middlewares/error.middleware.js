import CustomError from "../utils/errors/Custom.error.js";

const error = (err, req, res) => {
  if (err instanceof CustomError) {
    return res?.sendJSON({ message: err.message }, err.statusCode);
  }

  return res?.sendJSON({ message: "Internal Server Error" }, 500);
};

export default error;
