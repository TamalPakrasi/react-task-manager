import React from "react";

function TaskChecklist() {
  return (
    <ul className="mt-0.5 list">
      <li className="list-row items-center">
        <input type="checkbox" id="wireframe1" className="checkbox size-5" />
        <label htmlFor="wireframe1" className="font-semibold">
          Create Wireframe.
        </label>
      </li>
      <li className="list-row items-center">
        <input type="checkbox" id="wireframe2" className="checkbox size-5" />
        <label htmlFor="wireframe2" className="font-semibold">
          Create Wireframe.
        </label>
      </li>
    </ul>
  );
}

export default TaskChecklist;
