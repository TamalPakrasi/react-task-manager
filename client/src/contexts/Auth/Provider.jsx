import { useReducer } from "react";
import { AuthContext } from "./context";

// reducer and init state
import authReducer, { authInitState } from "@reducers/auth.reducer";

function Provider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitState);

  return (
    <AuthContext.Provider
      value={{ token: state.token, user: state.user, authDispatch: dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default Provider;
