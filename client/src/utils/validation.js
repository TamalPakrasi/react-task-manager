const validation = ({ field, value }) => {
  const errors = {};

  switch (field) {
    case "username":
      if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(value))
        errors[field] = "Invalid Username";
      break;

    case "email":
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
        errors[field] = "Invalid Email";
      break;

    case "password":
      if (value.length < 8)
        errors[field] =
          "Invalid Password - Password must be at least 8 characters";
      break;

    case "profilePic":
      if (value && !value.type.startsWith("image/")) {
        errors[field] = "Invalid Profile Picture -Only images allowed";
      }
      break;

    default:
      break;
  }
  return errors;
};

export default validation;
