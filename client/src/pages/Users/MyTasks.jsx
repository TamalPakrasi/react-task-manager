import { useEffect, useReducer } from "react";

import { TasksNav, Task, Loader, ErrorState } from "@components";

import { useFetchContext } from "@contexts/Fetch/context";

import useAxios from "@hooks/useAxios";

import myTasksReducer, { myTasksInitState } from "@reducers/myTasks.reducer";

function MyTasks() {
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

      console.log(data[0].tasks);

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

  if (isLoading) return <Loader className="loader-main" />;

  if (isError)
    return (
      <ErrorState
        title="Something Went Wrong"
        desc={errorMsg}
        onRetry={async () => await getTasks()}
      />
    );

  if (hasFetched)
    return (
      <>
        <TasksNav
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {tasksState.tasks.map(({ _id, ...task }) => (
            <Task key={_id} id={_id} task={task} />
          ))}
        </div>
      </>
    );
}

export default MyTasks;
