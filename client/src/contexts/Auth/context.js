import { createContext, useContext } from "react";

export const AuthContext = createContext({
  token: "",
  user: null,
  isAuthenticated: false,
  authDispatch: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
