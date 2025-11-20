import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../../", ".env") });

// Environment configuration for backend port
export const PORT = parseInt(process.env.PORT);

// Environment configuration for node environment
export const NODE_ENV = process.env.NODE_ENV || "development";

// Environment configuration for domain
export const DOMAIN = process.env.DOMAIN;

// Environment configuration for mongodb
export const MONGO_URI = process.env.MONGO_URI;

// Environment configuration for client side origin
export const CLIENT_SIDE_ORIGIN = process.env.CLIENT_SIDE_ORIGIN;

// Environment configuration for tokens
export const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// Environment configuaration for cloudinary
export const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
} = process.env;
