import { useRef, useReducer, useEffect, useState } from "react";

import { Users, Plus, Trash2, Paperclip } from "lucide-react";

import {
  Card,
  Modal,
  AssignedTo,
  Image,
  Loader,
  ErrorState,
} from "@components";

import useAlert from "@hooks/useAlert";
import useAxios from "@hooks/useAxios";

import { useFetchContext } from "@contexts/Fetch/context";

import createTaskReducer, {
  createTaskInitState,
} from "@reducers/createTask.reducer";

function CreateTask() {
  const formModalRef = useRef(null);

  const taskListRef = useRef(null);

  const attachmentsRef = useRef(null);

  const { get, post } = useAxios(true);

  const { isLoading, isError, errorMsg, hasFetched, fetchDispatch } =
    useFetchContext();

  const { error: errorAlert, success: successAlert } = useAlert();

  const [members, setMembers] = useState([]);

  const [taskState, taskDispatch] = useReducer(
    createTaskReducer,
    createTaskInitState
  );

  const createNewTask = async () => {
    const formdata = Object.fromEntries(
      Object.entries(taskState.data).map(([key, val]) => [
        key,
        val?.value ?? val,
      ])
    );

    try {
      await post({
        api: "/tasks",
        data: formdata,
      });

      taskDispatch({ type: "CLEAR_FORM" });

      successAlert("Task Created Successfully");

      formModalRef.current;
    } catch (error) {
      errorAlert(error.message);
    } finally {
      taskDispatch({ type: "STOP_SUBMITTING" });
    }
  };

  useEffect(() => {
    if (taskState.errors.length > 0) {
      errorAlert(taskState.errors.join(", "));
    }

    if (taskState.submit.hasValidationErrors) {
      errorAlert("Validation Error - Submission Failed");
    }

    if (
      !taskState.submit.hasValidationErrors &&
      taskState.submit.isSubmitting
    ) {
      createNewTask();
    }
  }, [taskState]);

  const getAllMembers = async () => {
    try {
      fetchDispatch({ type: "START_FETCHING" });
      const { data } = await get({ api: "/users" });

      setMembers(data);
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
    getAllMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    taskDispatch({
      type: "SET_VALUE",
      payload: { name, value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    taskDispatch({ type: "VALIDATE" });
  };

  const getImageUrl = (id) => {
    return members.find(({ _id }) => id === _id).profileImageUrl;
  };

  if (isLoading) return <Loader className="loader-main" />;

  if (isError)
    return (
      <ErrorState
        title="Something Went Wrong"
        desc={errorMsg}
        onRetry={async () => await getAllMembers()}
      />
    );

  if (hasFetched)
    return (
      <>
        <Card className="max-w-200">
          <h2 className="font-semibold text-lg">Create Task</h2>

          <form
            className="grid gap-y-6 gap-x-2 grid-cols-1 md:grid-cols-3"
            onSubmit={handleSubmit}
          >
            {/* task title */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">Title</h4>
              <input
                type="text"
                name="title"
                value={taskState.data.title.value}
                placeholder="Enter Task Title..."
                className={`input w-full mt-2 leading-5 ${
                  taskState.data.title.error ? "border-error outline-error" : ""
                } font-medium `}
                onChange={handleChange}
              />

              {taskState.data.title.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.title.error}
                </p>
              )}
            </div>

            {/* task description */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">Description</h4>
              <textarea
                name="description"
                value={taskState.data.description.value}
                placeholder="Enter Task Description..."
                className={`textarea w-full mt-2 leading-5 ${
                  taskState.data.description.error
                    ? "border-error outline-error"
                    : ""
                } font-medium`}
                onChange={handleChange}
              ></textarea>

              {taskState.data.description.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.description.error}
                </p>
              )}
            </div>

            {/* task priority */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Priority</h4>
              <select
                value={taskState.data.priority.value}
                name="priority"
                className={`select w-full ${
                  taskState.data.priority.error
                    ? "border-error outline-error"
                    : ""
                } mt-2`}
                onChange={handleChange}
              >
                <option value="" disabled={true}>
                  Choose Priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {taskState.data.priority.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.priority.error}
                </p>
              )}
            </div>

            {/* task due Date */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Due Date</h4>
              <input
                type="date"
                name="dueDate"
                min={new Date().toISOString().split("T")[0]}
                value={taskState.data.dueDate.value}
                className={`input w-full ${
                  taskState.data.dueDate.error
                    ? "border-error outline-error"
                    : ""
                } mt-2`}
                onChange={handleChange}
              />

              {taskState.data.dueDate.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.dueDate.error}
                </p>
              )}
            </div>

            {/* task Assigned to */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Assigned To</h4>
              {taskState.data.assignedTo.value.length === 0 ? (
                <button
                  type="button"
                  className="btn mt-2 btn-sm btn-secondary hover:btn-primary active:btn-primary"
                  onClick={() =>
                    formModalRef.current && formModalRef.current.showModal()
                  }
                >
                  <Users size={15} /> Add Memebers
                </button>
              ) : (
                <div
                  className="avatar-group -space-x-3 cursor-pointer"
                  onClick={() =>
                    formModalRef.current && formModalRef.current.showModal()
                  }
                >
                  {taskState.data.assignedTo.value?.slice(0, 3).map((id) => (
                    <div key={id} className="avatar">
                      <div className="w-7">
                        <Image img={getImageUrl(id)} />
                      </div>
                    </div>
                  ))}

                  {taskState.data.assignedTo.value.length > 3 && (
                    <div className="avatar avatar-placeholder">
                      <div className="bg-neutral text-neutral-content w-7">
                        <span>
                          +{taskState.data.assignedTo.value.length - 3}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {taskState.data.assignedTo.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.assignedTo.error}
                </p>
              )}
            </div>

            {/* Task check list */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">
                Task Checklist
              </h4>

              {taskState.data.taskCheckList.value.length > 0 && (
                <ul className="list gap-2 mt-2">
                  {taskState.data.taskCheckList.value.map((task, index) => (
                    <li className="list-row bg-neutral/15" key={task}>
                      {(index + 1).toString().padStart(2, "0")}{" "}
                      <span className="font-semibold">{task}</span>
                      <button
                        type="button"
                        className="float-end btn btn-xs btn-ghost"
                        onClick={() =>
                          taskDispatch({
                            type: "REMOVE_TASK_FROM_LIST",
                            payload: { task },
                          })
                        }
                      >
                        <Trash2 size={15} color="red" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="relative mt-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Task..."
                  className={`input w-full mt-2 leading-5 ${
                    taskState.data.taskCheckList.error
                      ? "border-error outline-error"
                      : ""
                  } font-medium `}
                  ref={taskListRef}
                />

                <button
                  type="button"
                  className="btn btn-xs btn-secondary absolute top-4 right-3 z-3"
                  onClick={() => {
                    if (taskListRef.current) {
                      const { value } = taskListRef.current;

                      if (value.trim().length > 0) {
                        taskListRef.current.value = "";
                        taskDispatch({
                          type: "ADD_TASK_TO_LIST",
                          payload: { task: value.trim() },
                        });
                      }
                    }
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              {taskState.data.taskCheckList.error && (
                <p className="text-error text-sm mt-1">
                  {taskState.data.taskCheckList.error}
                </p>
              )}
            </div>

            {/* Attachements */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">
                Add Attachments <span className="text-error">(optional)</span>
              </h4>

              {taskState.data.attachments.length > 0 && (
                <ul className="list gap-2 mt-2">
                  {taskState.data.attachments.map((attachment) => (
                    <li
                      className="list-row bg-neutral/15 items-center"
                      key={attachment}
                    >
                      <Paperclip size={15} />{" "}
                      <span className="font-semibold">{attachment}</span>{" "}
                      <button
                        type="button"
                        className="float-end btn btn-xs btn-ghost"
                        onClick={() => {
                          taskDispatch({
                            type: "REMOVE_ATTACHMENT",
                            payload: { attachment },
                          });
                        }}
                      >
                        <Trash2 size={15} color="red" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="relative mt-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Link..."
                  className={`input w-full mt-2 leading-5 font-medium `}
                  ref={attachmentsRef}
                />

                <button
                  type="button"
                  className="btn btn-xs btn-secondary absolute top-4 right-3 z-3"
                  onClick={() => {
                    if (attachmentsRef.current) {
                      const { value } = attachmentsRef.current;

                      if (value.trim().length > 0) {
                        attachmentsRef.current.value = "";
                        taskDispatch({
                          type: "ADD_ATTACHMENTS",
                          payload: { attachment: value.trim() },
                        });
                      }
                    }
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            <input
              type="submit"
              value={
                taskState.submit.isSubmitting ? "Submitting..." : "CREATE TASK"
              }
              disabled={taskState.submit.isSubmitting}
              className="btn btn-primary md:col-span-3 mt-3"
            />
          </form>
        </Card>

        <Modal modalRef={formModalRef}>
          <h4 className="text-lg text-neutral font-bold">Select Members</h4>

          <ul className="mt-7 list max-h-100 scrollbar">
            {members.map(({ _id, ...member }) => (
              <li className="list-row px-0" key={_id}>
                <AssignedTo
                  isForm={true}
                  onChange={({ checked, id }) =>
                    checked
                      ? taskDispatch({
                          type: "ADD_TO_ASSIGNED_TO",
                          payload: { id },
                        })
                      : taskDispatch({
                          type: "REMOVE_FROM_ASSIGNED_TO",
                          payload: { id },
                        })
                  }
                  id={_id}
                  assignedTo={member}
                  selectedMembers={taskState.data.assignedTo.value}
                />
              </li>
            ))}
          </ul>
        </Modal>
      </>
    );
}

export default CreateTask;
