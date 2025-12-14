import { useReducer, useEffect } from "react";
import { AuthContext } from "./context";

import useAxios from "@hooks/useAxios";
import useAlert from "@hooks/useAlert";

import { Loader } from "@components";

// reducer and init state
import authReducer, { authInitState } from "@reducers/auth.reducer";

function Provider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitState);

  const { post } = useAxios(true);

  const { error, success } = useAlert();

  useEffect(() => {
    const tryRefetch = async () => {
      dispatch({ type: "START_REFRESHING" });

      try {
        const { data } = await post({ api: "/auth/refresh" });

        dispatch({
          type: "LOGIN",
          payload: { token: data.token, user: data.user },
        });

        success("Welcome Back");
      } catch (err) {
        error("We couldn’t verify your session. Please Log in again");
      } finally {
        dispatch({ type: "STOP_REFRESHING" });
      }
    };

    tryRefetch();
  }, []);

  if (state.isLoading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authDispatch: dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default Provider;
