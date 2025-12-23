import {
  LayoutDashboard,
  ClipboardCheck,
  SquarePlus,
  Users2,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";

import useLogout from "@hooks/useLogout";

// admin links
const adminLinks = [
  {
    link: "/admin/dashboard",
    html: (
      <>
        <LayoutDashboard size={20} /> Dashboard
      </>
    ),
  },

  {
    link: "/admin/tasks",
    html: (
      <>
        <ClipboardCheck size={20} /> Manage Tasks
      </>
    ),
  },

  {
    link: "/admin/create-tasks",
    html: (
      <>
        <SquarePlus size={20} /> Create Tasks
      </>
    ),
  },

  {
    link: "/admin/members",
    html: (
      <>
        <Users2 /> Team Members
      </>
    ),
  },
];

// member links
const memberLinks = [
  {
    link: "/member/dashboard",
    html: (
      <>
        <LayoutDashboard size={20} /> Dashboard
      </>
    ),
  },

  {
    link: "/member/tasks",
    html: (
      <>
        <ClipboardCheck /> My Tasks
      </>
    ),
  },
];

function DrawerMenu({ drawerButtonRef }) {
  const { user } = useAuthContext();

  const links = user.role === "member" ? memberLinks : adminLinks;

  const { handleLogout } = useLogout();

  return (
    <ul className="mt-5 self-baseline w-full select-none">
      {links.map(({ link, html }) => (
        <li key={link}>
          <NavLink
            to={link}
            onClick={() =>
              drawerButtonRef.current && drawerButtonRef.current.click()
            }
            className={({ isActive }) =>
              `py-4 ${
                isActive ? "border-r-3 border-r-primary text-primary" : ""
              }`
            }
          >
            {html}
          </NavLink>
        </li>
      ))}

      <li>
        <button className="py-4" onClick={handleLogout}>
          <LogOut size={20} /> Log Out
        </button>
      </li>
    </ul>
  );
}

export default DrawerMenu;
