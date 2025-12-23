import { useRef } from "react";

import { PanelLeftOpen } from "lucide-react";

import { DrawerMenu, Avatar } from "@components";

import FetchProvider from "@contexts/Fetch/Provider";

function DashboardLayout({ children }) {
  const drawerButtonRef = useRef(null);

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashbord_drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content py-10 relative">
        <main className="mt-7 max-w-[95dvw] md:max-w-[97%] mx-auto">
          <FetchProvider>{children}</FetchProvider>
        </main>
        <label
          ref={drawerButtonRef}
          htmlFor="dashbord_drawer"
          className="btn drawer-button btn-ghost lg:hidden absolute top-1 left-1"
        >
          <PanelLeftOpen size={20} color="black" />
        </label>
      </div>
      <div
        className="drawer-side border-r border-base-300"
        style={{ height: "100dvh" }}
      >
        <label
          htmlFor="dashbord_drawer"
          aria-label="close sidebar"
          className="drawer-overlay h-dvh"
        ></label>

        <nav className="menu gap-3 items-center bg-base-200 h-dvh w-65 p-4">
          <h2 className="text-xl font-bold self-baseline">Task Manager</h2>

          <Avatar />

          <DrawerMenu drawerButtonRef={drawerButtonRef} />
        </nav>
      </div>
    </div>
  );
}

export default DashboardLayout;
