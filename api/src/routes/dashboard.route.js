import run from "../utils/run.js";

// controller
import * as dashboard from "../controllers/dashboard.controller.js";

// middlewares
import authProtect from "../middlewares/authProtect.middleware.js";
import hasRefreshToken from "../middlewares/hasRefreshToken.middleware.js";

const routes = async (req, res) => {
  if (req.api === "summary" && req.method === "GET") {
    return await run(req, res, hasRefreshToken, authProtect, dashboard.summary);
  }

  return res.sendJSON(400, "Route or Method is invalid");
};

export default routes;
