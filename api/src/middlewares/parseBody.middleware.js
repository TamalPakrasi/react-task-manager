const parseBody = (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }
  let data = "";

  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  req.on("end", () => {
    if (!data) {
      req.body = {};
      return next();
    }

    try {
      req.body = JSON.parse(data);
      next();
    } catch (err) {
      console.error("Invalid JSON");
      res.sendJSON({ message: "Invalid JSON" }, 400);
    }
  });

  req.on("error", () => {
    console.error("Error Parsing JSON Body");
    res.sendJSON({ message: "Something went wrong" }, 500);
  });
};

export default parseBody;
