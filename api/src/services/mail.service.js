import path from "path";
import fs from "fs/promises";
import throwMailError from "../utils/errors/Mail.error.js";

import transporter from "../config/mails/config.js";
import { APP_NAME, MAIL_PROVIDER } from "../config/env/env.js";

class MailService {
  static async sendMail({ to, subject, template, variables }) {
    try {
      const templatePath = path.resolve(
        import.meta.dirname,
        "../templates/",
        `${template}.template.html`
      );

      await fs.access(templatePath, fs.constants.F_OK);

      let html = await fs.readFile(templatePath, "utf-8");

      for (const key in variables) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
      }

      const info = await transporter.sendMail({
        from: `${APP_NAME} <${MAIL_PROVIDER}>`,
        to,
        subject,
        html,
      });

      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error Sending Mail:", error);

      throwMailError("Error Sending Mail");
    }
  }
}

export default MailService;
