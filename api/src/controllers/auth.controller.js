import authSevice from "../services/auth.service.js";
import { NODE_ENV } from "../config/env/env.js";

// @desc    POST register new user
// @route   POST /api/auth/register
// @access  public
export const register = async (req, res, next) => {
  try {
    const file = req.file;

    const { access_token, refresh_token } = await authSevice({
      ...req.body,
      file,
    }).register();

    res.setHeader(
      "Set-Cookie",
      `refresh_token=${
        refresh_token.token
      }; HttpOnly; Secure; SameSite=None; Expires=${refresh_token.expiry.toUTCString()}; path=/`
    );

    res.sendJSON(
      {
        message: "User Registered and Logged In Successfully",
        token: access_token.token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    POST loggin in existing user
// @route   POST /api/auth/login
// @access  public
export const login = async (req, res, next) => {};
