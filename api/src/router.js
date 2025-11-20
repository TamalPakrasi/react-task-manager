import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import tasksRoutes from "./routes/tasks.route.js";
import reportsRoutes from "./routes/reports.route.js";

const router = (req, res) => {
  const [route, endPoint] = req.url.replace("/api/", "").split("/");

  req.api = endPoint;

  switch (route) {
    case "auth":
      authRoutes(req, res);
      break;
    case "users":
      usersRoutes(req, res);
      break;
    case "tasks":
      tasksRoutes(req, res);
      break;
    case "reports":
      reportsRoutes(req, res);
      break;

    default:
      return res.sendJSON({ route: req.url, message: "Not Found" }, 404);
  }
};

export default router;
