import run from "../utils/run.js";

// controller
import * as reports from "../controllers/reports.controller.js";

// middlewares
import adminOnly from "../middlewares/admin.middleware.js";
import authProtect from "../middlewares/authProtect.middleware.js";
import hasRefreshToken from "../middlewares/hasRefreshToken.middleware.js";

const routes = async (req, res) => {
  const middlewares = [hasRefreshToken, authProtect, adminOnly];

  if (req.api === "exports/tasks" && req.method === "GET") {
    return await run(req, res, ...[...middlewares, reports.exportTasks]);
  }

  if (req.api === "exports/users" && req.method === "GET") {
    return await run(req, res, ...[...middlewares, reports.exportUsers]);
  }

  return res.sendJSON(400, "Route or Method is invalid");
};

export default routes;
