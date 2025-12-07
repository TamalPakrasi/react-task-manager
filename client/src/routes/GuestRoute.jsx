import React from "react";

import { useAuthContext } from "@contexts/Auth/context";
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated) {
    const { role } = user;

    return <Navigate to={`/${role}/dashboard`} />;
  }

  return children;
}

export default GuestRoute;
