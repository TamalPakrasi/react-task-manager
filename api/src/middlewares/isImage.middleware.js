import throwUploadError from "../utils/errors/Upload.error.js";

const isImage = (req, res, next) => {
  try {
    if (req.file) {
      const { mimeType } = req.file;
      if (!mimeType.startsWith("image/")) {
        throwUploadError("Profile Pic Must be an image", 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isImage;
