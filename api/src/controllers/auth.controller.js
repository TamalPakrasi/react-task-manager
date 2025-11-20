import authSevice from "../services/auth.service.js";

// @desc    POST register new user
// @route   POST /api/auth/register
// @access  public
export const register = async (req, res, next) => {
  try {
    const file = req.file;

    const user = await authSevice({
      ...req.body,
      file,
    }).register();

    res.sendJSON({ ...user }, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    POST loggin in existing user
// @route   POST /api/auth/login
// @access  public
export const login = async (req, res, next) => {};
