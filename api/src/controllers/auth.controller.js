import authSevice from "../services/auth.service.js";
import MailService from "../services/mail.service.js";

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

    const loginTime = new Date().toString();

    res.sendJSON(
      {
        message: "User Registered and Logged In Successfully",
        token: access_token.token,
        user,
      },
      201
    );

    MailService.sendMail({
      to: user.email,
      subject: "Login Successfull",
      template: "login",
      variables: {
        name: user.username,
        loginTime,
      },
    });
    return;
  } catch (error) {
    await next(error);
  }
};

// @desc    POST loggin in existing user
// @route   POST /api/auth/login
// @access  public (guest only)
export const login = async (req, res, next) => {
  try {
    const { access_token, refresh_token, user } = await authSevice({
      ...req.body,
    }).login();

    res.setHeader(
      "Set-Cookie",
      `refresh_token=${
        refresh_token.token
      }; HttpOnly; Secure; SameSite=None; Expires=${refresh_token.expiry.toUTCString()}; path=/`
    );

    const loginTime = new Date().toString();

    res.sendJSON(
      {
        message: "User Logged In Successfully",
        token: access_token.token,
        user,
      },
      200
    );

    MailService.sendMail({
      to: user.email,
      subject: "Login Successfull",
      template: "login",
      variables: {
        name: user.username,
        loginTime,
      },
    });
    return;
  } catch (error) {
    await next(error);
  }
};

// @desc    POST loggin out an authenticated user
// @route   POST /api/auth/logout
// @access  private (auth user)
export const logout = async (req, res, next) => {
  try {
    await authSevice().logout(req.user._id);

    res.setHeader(
      "Set-Cookie",
      "refresh_token=; path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    return res.sendJSON({ message: "User Logged Out Successfully" }, 200);
  } catch (error) {
    await next(error);
  }
};

// @desc    POST Issuing new tokens for authenticate user
// @route   POST /api/auth/refresh
// @access  private (auth user)
export const refresh = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { access_token, refresh_token, user } = await authSevice().refresh(
      id
    );

    res.setHeader(
      "Set-Cookie",
      `refresh_token=${
        refresh_token.token
      }; HttpOnly; Secure; SameSite=None; Expires=${refresh_token.expiry.toUTCString()}; path=/`
    );

    return res.sendJSON(
      {
        message: "Token Refreshed Successfully",
        token: access_token.token,
        user,
      },
      200
    );
  } catch (error) {
    await next(error);
  }
};
