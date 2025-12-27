import { useEffect, useReducer } from "react";

import { TasksNav, Task, Loader, ErrorState } from "@components";

import { useFetchContext } from "@contexts/Fetch/context";

import useAxios from "@hooks/useAxios";

import myTasksReducer, { myTasksInitState } from "@reducers/myTasks.reducer";

function AllTasks() {
  const [tasksState, tasksDispatch] = useReducer(
    myTasksReducer,
    myTasksInitState
  );

  const { isLoading, isError, hasFetched, errorMsg, fetchDispatch } =
    useFetchContext();

  const { get } = useAxios(true);

  const getStatus = () => {
    switch (tasksState.isActive) {
      case "Pending":
        return "pending";

      case "In Progress":
        return "in_progress";

      case "Completed":
        return "completed";

      default:
        return "";
    }
  };

  const getTasks = async () => {
    const status = getStatus();

    const api = status.length > 0 ? `/tasks?status=${status}` : `/tasks`;

    try {
      const { data } = await get({ api });

      tasksDispatch({
        type: "SET_DATA",
        payload: { statusSummary: data[1].statusSummary, tasks: data[0].tasks },
      });
    } catch (error) {
      fetchDispatch({
        type: "SET_ERROR",
        payload: { error: error.message },
      });
    } finally {
      fetchDispatch({ type: "STOP_FETCHING" });
    }
  };

  useEffect(() => {
    fetchDispatch({ type: "START_FETCHING" });

    getTasks();
  }, [tasksState.isActive]);

  return (
    <>
      <TasksNav
        navName="All Tasks"
        isActive={tasksState.isActive}
        setIsActive={(value) =>
          tasksDispatch({
            type: "SET_IS_ACTIVE",
            payload: {
              value,
            },
          })
        }
        statusSummary={tasksState.statusSummary}
      />

      {isLoading && <Loader className="loader-task" />}

      {isError && (
        <ErrorState
          title="Something Went Wrong"
          desc={errorMsg}
          onRetry={async () => await getTasks()}
        />
      )}

      {hasFetched &&
        (tasksState.tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
            {tasksState.tasks.map(({ _id, ...task }) => (
              <Task key={_id} id={_id} task={task} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-center text-lg font-bold">No Task Found</p>
        ))}
    </>
  );
}

export default AllTasks;
