export const authInitState = {
  token: "",
  user: null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case "LOGOUT":
      return authInitState;

    default:
      return state;
  }
};

export default authReducer;
