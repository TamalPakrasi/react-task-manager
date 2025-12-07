import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";
import DashboardLayout from "@layouts/DashboardLayout";

function PrivateRoute({ allowedRole }) {
  const { user } = useAuthContext();

  if (user.role !== allowedRole)
    return <Navigate to={`/${user.role}/dashboard`} />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default PrivateRoute;
