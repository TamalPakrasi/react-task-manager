import fs from "fs/promises";
import path from "path";

const logsDir = path.resolve(import.meta.dirname, "../../logs/");

await fs.mkdir(logsDir, { recursive: true });

const logPath = path.resolve(logsDir, "requests.log");

const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const timeTaken = Date.now() - start;

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
