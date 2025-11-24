import run from "../utils/run.js";

// controller
import * as auth from "../controllers/auth.controller.js";

// middlewares
import isImage from "../middlewares/isImage.middleware.js";
import guest from "../middlewares/guest.middleware.js";
import authProtect from "../middlewares/authProtect.middleware.js";
import hasRefreshToken from "../middlewares/hasRefreshToken.middleware.js";

const routes = async (req, res) => {
  if (req.api === "register" && req.method === "POST") {
    return await run(req, res, guest, isImage, auth.register);
  }

  if (req.api === "login" && req.method === "POST") {
    return await run(req, res, guest, auth.login);
  }

  if (req.api === "logout" && req.method === "POST") {
    return await run(req, res, authProtect, auth.logout);
  }

  if (req.api === "refresh" && req.method === "POST") {
    return await run(req, res, hasRefreshToken, auth.refresh);
  }

  return res.sendJSON(400, "Route or Method is invalid");
};

export default routes;
