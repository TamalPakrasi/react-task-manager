import { Suspense } from "react";
import { Outlet } from "react-router-dom";

// components
import { Loader } from "@components";

//protect
import Protect from "@/routes/Protect";

function MainLayout() {
  return (
    <Protect>
      <Suspense fallback={<Loader size="lg" />}>
        <Outlet />
      </Suspense>
    </Protect>
  );
}

export default MainLayout;
