import Busboy from "busboy";

const parseBody = (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }

  if (!req.headers["content-type"]) return next();

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
        next(err);
      }
    });

    req.on("error", (error) => {
      console.error("Error Parsing JSON Body", error);
      next(error);
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

    busboy.on("error", (error) => {
      console.error("Error parsing body", error);
      next(error);
    });

    req.pipe(busboy);
  }
};

export default parseBody;
