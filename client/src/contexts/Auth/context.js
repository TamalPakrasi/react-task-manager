import { createContext, useContext } from "react";

export const AuthContext = createContext({
  token: "",
  user: null,
  authDispatch: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
