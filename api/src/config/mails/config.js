import nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PASS, MAIL_PROVIDER } from "../env/env.js";

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: MAIL_PROVIDER,
    pass: MAIL_PASS,
  },
});

export default transporter;
