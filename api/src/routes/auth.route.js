import run from "../utils/run.js";
import * as auth from "../controllers/auth.controller.js";
import isImage from "../middlewares/isImage.middleware.js";
import guest from "../middlewares/guest.middleware.js";

const routes = async (req, res) => {
  if (req.api === "register" && req.method === "POST") {
    return await run(req, res, guest, isImage, auth.register);
  }

  if (req.api === "login" && req.method === "POST") {
    return await run(req, res, guest, auth.login);
  }

  return res.sendJSON({ message: "Route or Method is invalid" }, 400);
};

export default routes;
