import { useRef, useEffect, useState, useReducer } from "react";

import { Trash2, Plus, Paperclip, Users } from "lucide-react";

import { useFetchContext } from "@contexts/Fetch/context";

import useAxios from "@hooks/useAxios";
import useAlert from "@hooks/useAlert";

import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  Image,
  Loader,
  ErrorState,
  Modal,
  AssignedTo,
} from "@components";

import updateTaskReducer, {
  updateTaskInitState,
} from "@reducers/updateTask.reducer";

function updateTask() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);

  const [taskState, taskDispatch] = useReducer(
    updateTaskReducer,
    updateTaskInitState
  );

  const taskListRef = useRef(null);
  const attachmentsRef = useRef(null);
  const assignedToModalRef = useRef(null);
  const deleteModal = useRef(null);

  const { get, put, del } = useAxios(true);
  const { error: errorAlert } = useAlert();

  const { isLoading, isError, errorMsg, hasFetched, fetchDispatch } =
    useFetchContext();

  const loadContent = async () => {
    try {
      fetchDispatch({ type: "START_FETCHING" });

      const { data: membersData } = await get({ api: "/users" });
      setMembers(membersData);

      const { data: taskData } = await get({ api: `/tasks?id=${id}` });

      taskDispatch({ type: "SET_DATA", payload: { data: taskData } });
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
    loadContent();
  }, []);

  const updateTask = async () => {
    const formdata = Object.fromEntries(
      Object.entries(taskState.data).map(([key, val]) => [
        key,
        val?.value ?? val,
      ])
    );

    try {
      await put({
        api: `/tasks?id=${id}`,
        data: formdata,
      });

      navigate("/admin/tasks", {
        state: { message: "Task Updated Successfully" },
      });
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
      updateTask();
    }
  }, [taskState]);

  const deleteTask = async () => {
    setIsDeleteDisabled(true);

    deleteModal.current.close();

    try {
      await del({ api: `/tasks?id=${id}` });

      navigate("/admin/tasks", {
        state: { message: "Task Deleted Successfully" },
      });
    } catch (error) {
      setIsDeleteDisabled(false);
      errorAlert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    taskDispatch({ type: "VALIDATE" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    taskDispatch({ type: "CHANGE_DATA", payload: { value, name } });
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
        onRetry={async () => await loadContent()}
      />
    );

  if (hasFetched)
    return (
      <>
        <Card className="max-w-200">
          <div className="flex-between">
            <h2 className="text-lg font-bold">Update Task</h2>

            <button
              className="btn btn-sm btn-soft btn-error"
              disabled={isDeleteDisabled}
              onClick={() =>
                deleteModal.current && deleteModal.current.showModal()
              }
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          <form
            className="grid mt-3 gap-y-6 gap-x-2 grid-cols-1 md:grid-cols-3"
            onSubmit={handleSubmit}
          >
            {/* task title */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">Title</h4>
              <input
                type="text"
                name="title"
                value={taskState.data.title.value}
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
                    assignedToModalRef.current &&
                    assignedToModalRef.current.showModal()
                  }
                >
                  <Users size={15} /> Add Memebers
                </button>
              ) : (
                <div
                  className="avatar-group -space-x-3 cursor-pointer"
                  onClick={() =>
                    assignedToModalRef.current &&
                    assignedToModalRef.current.showModal()
                  }
                >
                  {taskState.data.assignedTo.value?.slice(0, 3).map((id) => (
                    <div className="avatar" key={id}>
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

            {/* task checklist */}
            <div className="md:col-span-3">
              <h4 className="text-xs text-neutral font-medium">
                Task Checklist
              </h4>

              {taskState.data.taskCheckList.value.length > 0 && (
                <ul className="list gap-2 mt-2">
                  {taskState.data.taskCheckList.value.map(({ text }, index) => (
                    <li className="list-row bg-neutral/15" key={text}>
                      {(index + 1).toString().padStart(2, "0")}{" "}
                      <span className="font-semibold">{text}</span>
                      <button
                        type="button"
                        className="float-end btn btn-xs btn-ghost"
                        onClick={() =>
                          taskDispatch({
                            type: "REMOVE_FROM_TASK_CHECKLIST",
                            payload: { text },
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
                          type: "ADD_TO_TASK_CHECKLIST",
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
                          type: "ADD_ATTACHMENT",
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
                taskState.submit.isSubmitting ? "...Submitting" : "UPDATE TASK"
              }
              disabled={taskState.submit.isSubmitting}
              className="btn btn-primary md:col-span-3 mt-3"
            />
          </form>
        </Card>

        <Modal modalRef={assignedToModalRef}>
          <h4 className="text-lg text-neutral font-bold">Update Members</h4>

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

        <Modal modalRef={deleteModal}>
          <p>Do you really want to delete this task ?</p>

          <button
            className="btn btn-sm btn-error mt-5 float-end"
            onClick={deleteTask}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </Modal>
      </>
    );
}

export default updateTask;
