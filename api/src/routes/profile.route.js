import run from "../utils/run.js";
import * as profile from "../controllers/profile.controller.js";

import authProtect from "../middlewares/authProtect.middleware.js";

const routes = async (req, res) => {
  if (req.api === "" && req.method === "GET") {
    return await run(req, res, authProtect, profile.get);
  }

  if (req.api === "" && req.method === "PUT") {
    return await run(req, res, authProtect, profile.update);
  }

  return res.sendJSON({ message: "Route or Method is invalid" }, 400);
};

export default routes;
