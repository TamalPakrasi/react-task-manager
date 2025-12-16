import React from "react";
import { TasksNav, Task } from "@components";

function MyTasks() {
  return (
    <div className="relative overflow-hidden">
      <TasksNav />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
        <Task />
        <Task />
        <Task />
      </div>
    </div>
  );
}

export default MyTasks;
