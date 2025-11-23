import http from "http";
import corsify from "corsify";

import { PORT, CLIENT_SIDE_ORIGIN } from "./config/env/env.js";

// runner function to run middlewares
import run from "./utils/run.js";

// middlewares
import logger from "./middlewares/Logger.middleware.js";
import parseParams from "./middlewares/parseParams.middleware.js";
import parseBody from "./middlewares/parseBody.middleware.js";
import parseCookies from "./middlewares/parseCookies.middleware.js";

// database connection
import { connectDB, client } from "./config/db/conn.js";

// router
import router from "./router.js";

// Connect the database
await connectDB();

// set up cors protection
const cors = corsify({
  "Access-Control-Allow-Origin": CLIENT_SIDE_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

const globals = [logger, parseParams, parseBody, parseCookies];

const server = http.createServer(
  cors(async (req, res) => {
    res.sendJSON = function (statusCode = 200, message, ...payload) {
      this.statusCode = statusCode;
      this.setHeader("Content-Type", "application/json");
      this.end(
        JSON.stringify({
          statusCode,
          status: statusCode >= 400 ? "Failed" : "Success",
          message,
          data:
            payload.length === 0
              ? null
              : payload.length === 1
              ? payload[0]
              : payload,
        })
      );
    };

    await run(
      req,
      res,
      ...[
        ...globals,
        async (req, res) => {
          if (!req.url.startsWith("/api/")) {
            return res.sendJSON({ route: req.url, message: "Not Found" }, 404);
          }

          await router(req, res);
        },
      ]
    );
  })
);

server.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});

// shutdown process
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await client.close();
  console.log("MongoDB Connetion is closing...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await client.close();
  console.log("MongoDB Connetion is closing...");
  process.exit(0);
});
