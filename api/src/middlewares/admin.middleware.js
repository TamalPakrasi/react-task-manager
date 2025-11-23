import throwAccessDeniedError from "../utils/errors/AccessDenied.error.js";

const adminOnly = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throwAccessDeniedError("Only Admins Can Access This");
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export default adminOnly;
