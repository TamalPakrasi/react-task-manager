import http from "http";
import { PORT } from "./config/env/env.js";

// runner function to run middlewares
import run from "./utils/run.js";

// middlewares
import logger from "./middlewares/Logger.middleware.js";
import parseBody from "./middlewares/parseBody.middleware.js";

// database connection
import { connectDB, client } from "./config/db/conn.js";

await connectDB();

const server = http.createServer(async (req, res) => {
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
    if (req.url === "/api" && req.method === "POST") {
      return res.sendJSON({ ...req.body }, 200);
    }
  });
});

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
