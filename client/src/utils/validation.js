const validation = ({ field, value }) => {
  let error = "";

  switch (field) {
    case "username":
      if (!/^[A-Za-z]+(?:\s[A-Za-z]*)*$/.test(value))
        error = "Invalid Username";
      break;

    case "email":
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
        error = "Invalid Email";
      break;

    case "password":
      if (value.length < 8)
        error = "Invalid Password - Password must be at least 8 characters";
      break;

    case "profilePic":
      if (value && !value.type.startsWith("image/")) {
        error = "Invalid Profile Picture -Only images allowed";
      }
      break;
  }

  return error;
};

export default validation;
