import { Navigate } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";

function Protect({ children }) {
  const { isAuthenticated, token } = useAuthContext();

  if (!isAuthenticated) {
    console.log(token);
    return <Navigate to="/auth/login" />;
  }

  return children;
}

export default Protect;
