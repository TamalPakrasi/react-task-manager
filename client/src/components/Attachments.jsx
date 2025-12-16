import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";

function Attachments() {
  return (
    <ul className="list mt-1 gap-4">
      <li className="list-row bg-base-300">
        <div className="text-sm font-normal tabular-nums">01</div>
        <p className="select-none">https://react.dev</p>
        <button
          className="cursor-pointer"
          onClick={() => open("https://react.dev")}
        >
          <SquareArrowOutUpRight size={15} />
        </button>
      </li>

      <li className="list-row bg-base-300">
        <div className="text-sm font-normal tabular-nums">01</div>
        <p className="select-none">https://react.dev</p>
        <button
          className="cursor-pointer"
          onClick={() => open("https://react.dev")}
        >
          <SquareArrowOutUpRight size={15} />
        </button>
      </li>
    </ul>
  );
}

export default Attachments;
