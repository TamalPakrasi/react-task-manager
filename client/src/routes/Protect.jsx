import { Navigate } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";

function Protect({ children }) {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? children : <Navigate to="/auth/login" />;
}

export default Protect;
