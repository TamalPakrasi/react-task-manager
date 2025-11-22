import authSevice from "../services/auth.service.js";
import { NODE_ENV } from "../config/env/env.js";

// @desc    POST register new user
// @route   POST /api/auth/register
// @access  public (guest only)
export const register = async (req, res, next) => {
  try {
    const file = req.file;

    const { access_token, refresh_token, user } = await authSevice({
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
        user,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    POST loggin in existing user
// @route   POST /api/auth/login
// @access  public (guest only)
export const login = async (req, res, next) => {};

// @desc    POST loggin out an authenticated user
// @route   POST /api/auth/logout
// @access  private (auth user)
export const logout = async (req, res, next) => {
  try {
    console.log(req.user);
    await authSevice().logout(req.user._id);

    res.setHeader("Set-Header", "refresh_token= ; Max-Age=0");
    res.sendJSON({ message: "User Logged Out Successfully" }, 200);
  } catch (error) {
    next(error);
  }
};
