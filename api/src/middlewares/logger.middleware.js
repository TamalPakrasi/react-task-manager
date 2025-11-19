import fs from "fs/promises";
import path from "path";

const logPath = path.resolve(import.meta.dirname, "../../logs/requests.log");

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
