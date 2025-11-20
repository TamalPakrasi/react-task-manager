import cloudinary from "../config/cloudinary/config.js";
import streamifier from "streamifier";

class Uplaod {
  static uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}

export default Uplaod;
