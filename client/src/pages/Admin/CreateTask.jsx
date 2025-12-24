import { useRef, useReducer, useEffect } from "react";

import { Users, Plus, Trash2, Paperclip } from "lucide-react";

import { Card, Modal, AssignedTo } from "@components";

import useAlert from "@hooks/useAlert";

import createTaskReducer, {
  createTaskInitState,
} from "@reducers/createTask.reducer";

function CreateTask() {
  const formModalRef = useRef(null);

  const taskListRef = useRef(null);

  const attachmentsRef = useRef(null);

  const [taskState, taskDispatch] = useReducer(
    createTaskReducer,
    createTaskInitState
  );

  const { error: errorAlert } = useAlert();

  useEffect(() => {
    if (taskState.error.length > 0) {
      errorAlert(taskState.error.join(", "));
    }
  }, [taskState]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.trim().length > 0)
      taskDispatch({
        type: "SET_VALUE",
        payload: { name, value: value.trim() },
      });
  };

  return (
    <>
      <Card className="max-w-200">
        <h2 className="font-semibold text-lg">Create Task</h2>

        <form className="grid gap-y-6 gap-x-2 grid-cols-1 md:grid-cols-3">
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

          <div>
            <h4 className="text-xs text-neutral font-medium">Due Date</h4>
            <input
              type="date"
              name="dueDate"
              min={new Date().toISOString().split("T")[0]}
              value={taskState.data.dueDate.toISOString().split("T")[0]}
              className="input w-full mt-2"
              onChange={handleChange}
            />
          </div>

          <div>
            <h4 className="text-xs text-neutral font-medium">Assigned To</h4>
            <button
              type="button"
              className="btn mt-2 btn-sm btn-secondary hover:btn-primary active:btn-primary"
              onClick={() =>
                formModalRef.current && formModalRef.current.showModal()
              }
            >
              <Users size={15} /> Add Memebers
            </button>
          </div>

          {/* Task check list */}
          <div className="md:col-span-3">
            <h4 className="text-xs text-neutral font-medium">Task Checklist</h4>

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

        <form>
          <ul className="mt-7 list max-h-100 scrollbar">
            <li className="list-row px-0">
              <AssignedTo isForm={true} />
            </li>
            <li className="list-row px-0">
              <AssignedTo isForm={true} />
            </li>
            <li className="list-row px-0">
              <AssignedTo isForm={true} />
            </li>
          </ul>

          <div
            className="py-2 w-full flex justify-end items-center gap-3"
            onClick={() => formModalRef.current && formModalRef.current.close()}
          >
            <button type="button" className="btn btn-sm btn-neutral">
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              Done
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CreateTask;
