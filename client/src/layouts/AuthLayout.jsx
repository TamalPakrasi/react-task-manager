import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}

export default AuthLayout;
