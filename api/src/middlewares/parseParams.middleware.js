import { NODE_ENV } from "../config/env/env.js";

const parseParams = (req, res, next) => {
  if (req.url.endsWith("/")) req.url = req.url.slice(0, -1);

  req.query = {};

  const url = new URL(
    req.url,
    `${NODE_ENV === "development" ? "http" : "https"}://${req.headers.host}`
  );

  req.pathname = url.pathname;

  if ([...url.searchParams].length > 0) {
    req.query = Object.fromEntries(url.searchParams.entries());
  }

  next();
};

export default parseParams;
