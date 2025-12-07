import React from "react";

import { PanelLeftOpen } from "lucide-react";

import { DrawerMenu, Avatar } from "@components";

function DashboardLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashbord_drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {children}
        <label
          htmlFor="dashbord_drawer"
          className="btn drawer-button btn-ghost lg:hidden fixed top-1 left-1"
        >
          <PanelLeftOpen size={20} color="black" />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="dashbord_drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <nav className="menu gap-3 items-center bg-base-200 min-h-full w-80 p-4">
          <h2 className="text-xl font-bold self-baseline">Task Manager</h2>

          <Avatar />

          <DrawerMenu />
        </nav>
      </div>
    </div>
  );
}

export default DashboardLayout;
