import http from "http";
import corsify from "corsify";

import { PORT, CLIENT_SIDE_ORIGIN } from "./config/env/env.js";

// runner function to run middlewares
import run from "./utils/run.js";

// middlewares
import logger from "./middlewares/Logger.middleware.js";
import parseBody from "./middlewares/parseBody.middleware.js";

// database connection
import { connectDB, client } from "./config/db/conn.js";

// Connect the database
await connectDB();

// set up cors protection
const cors = corsify({
  "Access-Control-Allow-Origin": CLIENT_SIDE_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

const server = http.createServer(
  cors(async (req, res) => {
    res.sendJSON = function (message, statusCode = 200) {
      this.statusCode = statusCode;
      this.setHeader("Content-Type", "application/json");
      this.end(
        JSON.stringify({
          statusCode,
          data: message,
        })
      );
    };

    if (req.url.endsWith("/")) req.url = req.url.slice(0, -1);

    await run(req, res, logger, parseBody, (req, res, next) => {
      if (req.url === "/api" && req.method === "GET") {
        res.setHeader(
          "Set-Cookie",
          "sessionId=123; HttpOnly; Path=/; SameSite=None; Secure"
        );
        return res.sendJSON({ msg: "hello" }, 200);
      }
      if (req.url === "/api" && req.method === "POST") {
        return res.sendJSON({ msg: req.headers.cookie }, 200);
      }
    });
  })
);

server.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});

// shutdown process
process.emit("SIGINT", async () => {
  console.log("Shutting down...");
  await client.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await client.close();
  process.exit(0);
});
