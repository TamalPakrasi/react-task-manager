import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import usersRoutes from "./routes/users.route.js";
import tasksRoutes from "./routes/tasks.route.js";
import reportsRoutes from "./routes/reports.route.js";

const router = async (req, res) => {
  const [route, endPoint] = req.url.replace("/api/", "").split("/");

  req.api = endPoint ?? "";

  switch (route) {
    case "auth":
      await authRoutes(req, res);
      break;
    case "profile":
      await profileRoutes(req, res);
      break;
    case "users":
      await usersRoutes(req, res);
      break;
    case "tasks":
      await tasksRoutes(req, res);
      break;
    case "reports":
      await reportsRoutes(req, res);
      break;

    default:
      return res.sendJSON({ route: req.url, message: "Not Found" }, 404);
  }
};

export default router;
