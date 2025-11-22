import fs from "fs/promises";
import path from "path";
import { performance } from "perf_hooks";

const logsDir = path.resolve(import.meta.dirname, "../../logs/");

const logger = async (req, res, next) => {
  await fs.mkdir(logsDir, { recursive: true });

  const logPath = path.resolve(logsDir, "requests.log");
  const start = performance.now();

  res.on("finish", async () => {
    const timeTaken = (performance.now() - start).toFixed(2);

    const data = `[${new Date().toISOString()}] ${req.method} ${
      req.url
    } - STATUS:${res.statusCode} - TIME:${timeTaken}ms\n`;

    console.log(data);

    try {
      await fs.appendFile(logPath, data);
    } catch (error) {
      console.error("Error writing log");
    }
  });

  next();
};

export default logger;
