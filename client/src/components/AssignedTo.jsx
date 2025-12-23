import React from "react";

import Image from "./Image";

function AssignedTo({ img }) {
  return (
    <div className="flex items-center gap-3">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <Image img={img} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm text-neutral font-semibold">Tamal Pakrasi</h4>
        <p className="text-xs text-neutral">tamalpakrasi8@gmail.com</p>
      </div>
    </div>
  );
}

export default AssignedTo;
