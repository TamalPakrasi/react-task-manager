import { useState, useEffect } from "react";

import Image from "./Image";

import { useAuthContext } from "@contexts/Auth/context";

function AssignedTo({
  assignedTo,
  id,
  isForm = false,
  add = null,
  remove = null,
}) {
  const { user } = useAuthContext();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isForm) {
      isChecked ? add(id) : remove(id);
    }
  }, [isForm, isChecked]);

  return (
    <div className="flex items-center gap-3 col-span-2">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <Image img={assignedTo?.profileImageUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {/* <h4
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
        </p> */}
        <h4 className={`text-sm text-neutral font-semibold`}>Tamal Pakrasi</h4>
        <p className={`text-xs text-neutral`}>tamalpakrasi8@gmail.com</p>
      </div>

      {isForm && (
        <div className="grow">
          <input
            type="checkbox"
            checked={isChecked}
            className="float-end checkbox size-5"
            onChange={() => setIsChecked((p) => !p)}
          />
        </div>
      )}
    </div>
  );
}

export default AssignedTo;
