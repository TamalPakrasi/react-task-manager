import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";

function PrivateRoute({ allowedRole }) {
  const { user } = useAuthContext();

  if (user.role !== allowedRole)
    return <Navigate to={`/${user.role}/dashboard`} />;

  return <Outlet />;
}

export default PrivateRoute;
