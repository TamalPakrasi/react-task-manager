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

  const { error: errorAlert } = useAlert();

  const [members, setMembers] = useState([]);

  const [taskState, taskDispatch] = useReducer(
    createTaskReducer,
    createTaskInitState
  );

  useEffect(() => {
    if (taskState.error.length > 0) {
      errorAlert(taskState.error.join(", "));
    }
  }, [taskState]);

  const getAllMembers = async () => {
    try {
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
    fetchDispatch({ type: "START_FETCHING" });
    getAllMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length > 0)
      taskDispatch({
        type: "SET_VALUE",
        payload: { name, value: value.trim() },
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                value={taskState.data.title}
                placeholder="Enter Task Title..."
                className={`input w-full mt-2 leading-5 font-medium `}
                onChange={handleChange}
              />
            </div>

            {/* task description */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">Description</h4>
              <textarea
                name="description"
                value={taskState.data.description}
                placeholder="Enter Task Description..."
                className={`textarea w-full mt-2 leading-5 font-medium`}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* task priority */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Priority</h4>
              <select
                value={taskState.data.priority}
                name="priority"
                className={`select w-full mt-2`}
                onChange={handleChange}
              >
                <option value="" disabled={true}>
                  Choose Priority
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* task due Date */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Due Date</h4>
              <input
                type="date"
                name="dueDate"
                min={new Date().toISOString().split("T")[0]}
                value={
                  taskState.data.dueDate instanceof Date
                    ? taskState.data.dueDate.toISOString().split("T")[0]
                    : ""
                }
                className="input w-full mt-2"
                onChange={handleChange}
              />
            </div>

            {/* task Assigned to */}
            <div>
              <h4 className="text-xs text-neutral font-medium">Assigned To</h4>
              {taskState.data.assignedTo.length === 0 ? (
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
                  {taskState.data.assignedTo?.slice(0, 3).map((id) => (
                    <div key={id} className="avatar">
                      <div className="w-7">
                        <Image img={getImageUrl(id)} />
                      </div>
                    </div>
                  ))}

                  {taskState.data.assignedTo.length > 3 && (
                    <div className="avatar avatar-placeholder">
                      <div className="bg-neutral text-neutral-content w-7">
                        <span>+{taskState.data.assignedTo.length - 3}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Task check list */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">
                Task Checklist
              </h4>

              {taskState.data.taskCheckList.length > 0 && (
                <ul className="list gap-2 mt-2">
                  {taskState.data.taskCheckList.map((task, index) => (
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
                  className={`input w-full mt-2 leading-5 font-medium `}
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
            </div>

            {/* Attachements */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">
                Add Attachments
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
              value="CREATE TASK"
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
                  add={(id) =>
                    taskDispatch({
                      type: "ADD_TO_ASSIGNED_TO",
                      payload: { id },
                    })
                  }
                  remove={(id) =>
                    taskDispatch({
                      type: "REMOVE_FROM_ASSIGNED_TO",
                      payload: { id },
                    })
                  }
                  id={_id}
                  assignedTo={member}
                />
              </li>
            ))}
          </ul>
        </Modal>
      </>
    );
}

export default CreateTask;
