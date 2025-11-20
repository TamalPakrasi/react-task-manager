import Busboy from "busboy";

const parseBody = (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }

  // For regular json based payload
  if (req.headers["content-type"].includes("application/json")) {
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
  }

  // When form data is being uploaded
  else if (req.headers["content-type"].includes("multipart/form-data")) {
    const busboy = Busboy({ headers: req.headers });

    req.body = {};
    req.file = null;

    busboy.on("field", (name, value) => {
      req.body[name] = value;
    });

    busboy.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;

      const chunks = [];

      file.on("data", (chunk) => chunks.push(chunk));

      file.on("end", () => {
        const buffer = Buffer.concat(chunks);

        req.file = {
          fieldname: name,
          originalname: filename,
          encoding,
          mimeType,
          buffer,
          size: buffer.length,
        };
      });
    });

    busboy.on("finish", () => next());

    busboy.on("error", (err) => {
      console.error(err);
      res.sendJSON({ message: "Something went wrong" }, 500);
    });

    req.pipe(busboy);
  }
};

export default parseBody;
