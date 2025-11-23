import error from "../middlewares/error.middleware.js";

const run = async (req, res, ...fns) => {
  let index = 0;

  const next = async (err = null) => {
    if (res.writableEnded) return;

    if (err instanceof Error) {
      console.log(err);
      return error(err, req, res);
    }

    const fn = fns[index++];

    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Middleware error:", error);
      res.sendJSON(500, "Something Went wrong");
    }
  };

  await next();
};

export default run;
