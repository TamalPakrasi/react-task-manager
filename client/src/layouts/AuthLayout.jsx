import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import { Loader } from "@components";

function AuthLayout() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <Suspense fallback={<Loader size="lg" />}>
      <Outlet context={handleSubmit} />
    </Suspense>
  );
}

export default AuthLayout;
