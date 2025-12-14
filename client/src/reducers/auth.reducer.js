export const authInitState = {
  token: "",
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated:
          action.payload.token.length > 0 && action.payload.user !== null,
      };

    case "START_REFRESHING":
      return { ...state, isLoading: true };

    case "STOP_REFRESHING":
      return { ...state, isLoading: false };

    case "LOGOUT":
      return authInitState;

    case "REFRESH":
      return {
        ...state,
        token: action.payload.new_token,
      };

    default:
      return state;
  }
};

export default authReducer;
