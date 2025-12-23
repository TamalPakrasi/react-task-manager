import { useState, useEffect, useReducer } from "react";
import { TasksNav, Task } from "@components";

import myTasksReducer, { myTasksInitState } from "@reducers/myTasks.reducer";

function MyTasks() {
  const [isActive, setIsActive] = useState("All");
  const [tasksState, tasksDispatch] = useReducer(
    myTasksReducer,
    myTasksInitState
  );

  useEffect(() => {}, [isActive]);

  return (
    <>
      <TasksNav isActive={isActive} setIsActive={setIsActive} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
        <Task />
        <Task />
        <Task />
      </div>
    </>
  );
}

export default MyTasks;
