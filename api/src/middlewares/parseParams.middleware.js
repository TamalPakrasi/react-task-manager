import { NODE_ENV } from "../config/env/env.js";

const parseParams = (req, res, next) => {
  if (req.url.endsWith("/")) req.url = req.url.slice(0, -1);

  const url = new URL(
    req.url,
    `${NODE_ENV === "development" ? "http" : "https"}://${req.headers.host}`
  );

  if ([...url.searchParams].length > 0) {
    req.query = Object.fromEntries(url.searchParams.entries());
  }

  req.pathname = req.url.split("?")[0];
  next();
};

export default parseParams;
