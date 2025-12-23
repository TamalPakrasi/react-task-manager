import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";

function Attachments({ attachments }) {
  return (
    <ul className="list mt-1 gap-4">
      {attachments.map((value, index) => (
        <li className="list-row bg-base-300" key={index}>
          <div className="text-sm font-normal tabular-nums">
            {(index + 1).toString().padStart(2, "0")}
          </div>
          <p className="select-none">{value}</p>
          <button className="cursor-pointer" onClick={() => open(value)}>
            <SquareArrowOutUpRight size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Attachments;
