import React from "react";

import Image from "./Image";

import { useAuthContext } from "@contexts/Auth/context";

function AssignedTo({ assignedTo, id }) {
  const { user } = useAuthContext();

  return (
    <div className="flex items-center gap-3">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <Image img={assignedTo.profileImageUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4
          className={`text-sm text-neutral ${
            id === user._id ? "font-bold" : "font-semibold"
          }`}
        >
          {assignedTo.username} {id === user._id && "(You)"}
        </h4>
        <p
          className={`text-xs text-neutral ${
            id === user._id ? "font-semibold" : ""
          }`}
        >
          {assignedTo.email}
        </p>
      </div>
    </div>
  );
}

export default AssignedTo;
