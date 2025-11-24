import run from "../utils/run.js";

// controller
import * as tasks from "../controllers/tasks.controller.js";

// middlewares
import authProtect from "../middlewares/authProtect.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import hasRefreshToken from "../middlewares/hasRefreshToken.middleware.js";

const endPoints = {
  true: {
    GET: {
      default: tasks.getTaskById,
    },
    PUT: {
      default: tasks.updateTask,
      status: tasks.updateTaskStatus,
      todo: tasks.updateTaskCheckList,
    },
    DELETE: {
      default: tasks.deleteTask,
    },
  },
  false: {
    GET: {
      "dashboard-data": tasks.getDashboradData,
      "user-dashboard-data": tasks.getUserDashboardData,
      default: tasks.getTasks,
    },
    POST: {
      default: tasks.createTask,
    },
  },
};

const allowedEndPoints = [
  "dashboard-data",
  "user-dashboard-data",
  "status",
  "todo",
  "default",
];

const commons = [hasRefreshToken, authProtect];

const badRoute = () => res.sendJSON(400, "Route or Method is invalid");

const routes = async (req, res) => {
  const hasId = Boolean(req.query.id);

  // determine middlewares
  const middlewares =
    req.method === "POST" || req.method === "DELETE"
      ? [...commons, adminOnly]
      : commons;

  if (req.api === "") req.api = "default";

  if (!allowedEndPoints.includes(req.api)) return badRoute();

  const list = endPoints[String(hasId)];

  if (!(req.method in list)) return badRoute();

  const routes = list[req.method];

  if (!(req.api in routes)) return badRoute();

  return await run(req, res, ...[...middlewares, routes[req.api]]);
};

export default routes;
