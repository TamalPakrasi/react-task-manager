import React from "react";

import { useAuthContext } from "@contexts/Auth/context";

import Image from "./Image";

function Avatar() {
  const { user } = useAuthContext();

  return (
    <>
      <div className="avatar mt-7">
        <div className="w-24 rounded-full">
          <Image img={user?.profileImageUrl} />
        </div>
      </div>

      <div className="badge badge-primary text-white select-none cursor-pointer">
        {user.role || "Member"}
      </div>

      <h2 className="text-lg font-semibold mt-3">
        {user.username || "Member#12121"}
      </h2>

      <span className="text-base font-normal">
        {user.email || "member@demo.com"}
      </span>
    </>
  );
}

export default Avatar;
