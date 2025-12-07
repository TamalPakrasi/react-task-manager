import { Navigate } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";

function Protect({ children }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return children;
}

export default Protect;
