import throwValidationError from "../utils/errors/validation.error.js";

class Validation {
  static validateRegistrationCredentials(username, email, pass) {
    const errors = [];

    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(username)) {
      errors.push("Invalid Username");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push("Invalid Email");
    }

    if (!pass || !pass.trim()) {
      errors.push("Invalid Password");
    }

    if (errors.length > 0) {
      throwValidationError(errors.join(", "));
    }
  }

  static validateLogInCredentials(email, pass) {
    const errors = [];

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push("Invalid Email");
    }

    if (!pass || !pass.trim()) {
      errors.push("Invalid Password");
    }

    if (errors.length > 0) {
      throwValidationError(errors.join(", "));
    }
  }
}

export default Validation;
