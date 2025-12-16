import { useState } from "react";

function TasksNav({ name = "My Tasks" }) {
  const [isActive, setIsActive] = useState("All");

  const handleClick = (e) => {
    const btn = e.currentTarget;

    const text = Array.from(btn.childNodes)
      .find((node) => node.nodeType === Node.TEXT_NODE)
      ?.textContent.trim();

    setIsActive(text);
  };

  return (
    <nav className="bg-base-200 px-5 py-4 rounded-box flex-col gap-3 md:gap-0 md:flex-row flex-between">
      <h2 className="text-xl font-semibold">{name}</h2>

      <ul className="menu justify-center menu-horizontal gap-2">
        <li>
          <button
            className={
              isActive === "All"
                ? "text-primary border-b-2 border-b-primary"
                : ""
            }
            onClick={handleClick}
          >
            All
            <div
              className={`badge badge-sm ${
                isActive === "All" ? "badge-primary text-white" : ""
              }`}
            >
              10
            </div>
          </button>
        </li>
        <li>
          <button
            className={
              isActive === "Pending"
                ? "text-primary border-b-2 border-b-primary"
                : ""
            }
            onClick={handleClick}
          >
            Pending
            <div
              className={`badge badge-sm ${
                isActive === "Pending" ? "badge-primary text-white" : ""
              }`}
            >
              10
            </div>
          </button>
        </li>
        <li>
          <button
            className={
              isActive === "In Progress"
                ? "text-primary border-b-2 border-b-primary"
                : ""
            }
            onClick={handleClick}
          >
            In Progress
            <div
              className={`badge badge-sm ${
                isActive === "In Progress" ? "badge-primary text-white" : ""
              }`}
            >
              10
            </div>
          </button>
        </li>
        <li>
          <button
            className={
              isActive === "Completed"
                ? "text-primary border-b-2 border-b-primary"
                : ""
            }
            onClick={handleClick}
          >
            Completed
            <div
              className={`badge badge-sm ${
                isActive === "Completed" ? "badge-primary text-white" : ""
              }`}
            >
              10
            </div>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default TasksNav;
