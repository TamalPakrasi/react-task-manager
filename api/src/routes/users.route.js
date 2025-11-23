import run from "../utils/run.js";

// controllers
import * as users from "../controllers/users.controller.js";

// middlewares
import authProtect from "../middlewares/authProtect.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import hasRefreshToken from "../middlewares/hasRefreshToken.middleware.js";

const routes = async (req, res) => {
  const hasId = Boolean(req.query.id);

  if (req.api === "" && !hasId && req.method === "GET") {
    return await run(
      req,
      res,
      hasRefreshToken,
      authProtect,
      adminOnly,
      users.getUsers
    );
  }

  if (req.api === "" && hasId && req.method === "GET") {
    return await run(req, res, hasRefreshToken, authProtect, users.getUserById);
  }

  if (req.api === "" && hasId && req.method === "DELETE") {
    return await run(
      req,
      res,
      hasRefreshToken,
      authProtect,
      adminOnly,
      users.deleteUser
    );
  }

  return res.sendJSON({ message: "Route or Method is invalid" }, 400);
};

export default routes;
