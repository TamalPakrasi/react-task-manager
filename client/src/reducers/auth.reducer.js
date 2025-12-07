export const authInitState = {
  token: "",
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.payload.token, user: action.payload.user };

    case "LOGOUT":
      return authInitState;

    default:
      return state;
  }
};

export default authReducer;
