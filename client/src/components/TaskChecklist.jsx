import React from "react";

function TaskChecklist({ list = [], id }) {
  return (
    <ul className="mt-0.5 list">
      {list.map(({ text, completed }) => (
        <li className="list-row px-0" key={text}>
          <input
            type="checkbox"
            id="wireframe1"
            className="checkbox size-5"
            checked={completed}
            onChange={() => {}}
          />
          <label htmlFor="wireframe1" className="font-semibold">
            {text}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default TaskChecklist;
