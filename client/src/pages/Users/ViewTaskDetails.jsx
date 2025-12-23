import { useRef, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  Card,
  TaskChecklist,
  Attachments,
  Modal,
  AssignedTo,
  ErrorState,
  Loader,
  Image,
} from "@components";

import { useFetchContext } from "@contexts/Fetch/context";
import { useAuthContext } from "@contexts/Auth/context";

import useAxios from "@hooks/useAxios";

import formatCreatedAt from "@utils/formateCreatedAt";

function ViewTaskDetails() {
  const modalRef = useRef(null);

  const [task, setTask] = useState(null);

  const { user } = useAuthContext();

  const { id } = useParams();

  const { isLoading, isError, errorMsg, hasFetched, fetchDispatch } =
    useFetchContext();

  const { get } = useAxios(true);

  const getTaskById = async () => {
    fetchDispatch({ type: "START_FETCHING" });

    try {
      const { data } = await get({ api: `/tasks?id=${id}` });

      setTask(data);
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
    getTaskById();
  }, []);

  if (isLoading) return <Loader className="loader-main" />;

  if (isError)
    return (
      <ErrorState
        title="Something Went Wrong"
        desc={errorMsg}
        onRetry={async () => await getTaskById()}
      />
    );

  if (hasFetched && task) {
    const userDetails = task.assignedTo.find(({ _id }) => _id === user._id);

    const otherUsers = task.assignedTo.filter(({ _id }) => _id !== user._id);

    return (
      <>
        <Card className="max-w-200">
          <div className="flex-between">
            <h2 className="font-semibold text-base">{task.title}</h2>
            <div className="badge badge-soft badge-primary whitespace-nowrap">
              {task.status}
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-xs text-neutral font-medium">Description</h4>
            <p className="mt-0.5 leading-5 font-semibold">{task.description}</p>
          </div>

          <div className="mt-2 flex-between">
            <div>
              <h4 className="text-xs text-neutral font-medium">Priority</h4>
              <span className="mt-0.5 font-semibold">{task.priority}</span>
            </div>

            <div>
              <h4 className="text-xs text-neutral font-medium">Due Date</h4>
              <span className="mt-0.5 font-semibold">
                {formatCreatedAt(task.dueDate)}
              </span>
            </div>

            <div>
              <h4 className="text-xs text-neutral font-medium">Assigned To</h4>
              <div
                className="avatar-group -space-x-3 mt-0.5 cursor-pointer"
                onClick={() => modalRef.current && modalRef.current.showModal()}
              >
                <div className="avatar">
                  <div className="w-7">
                    <Image img={userDetails.profileImageUrl} />
                  </div>
                </div>

                {otherUsers
                  ?.slice(0, 2)
                  .map(({ _id, profileImageUrl = null }) => (
                    <div key={_id} className="avatar">
                      <div className="w-7">
                        <Image img={profileImageUrl} />
                      </div>
                    </div>
                  ))}

                {task.assignedTo.length > 3 && (
                  <div className="avatar avatar-placeholder">
                    <div className="bg-neutral text-neutral-content w-7">
                      <span>+{task.assignedTo.length - 3}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-xs text-neutral font-medium">Task Checklist</h4>
            <TaskChecklist id={task._id} list={task.taskCheckList} />
          </div>

          {task.attachments?.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs text-neutral font-medium">Attachments</h4>
              <Attachments id={task._id} attachments={task.attachments} />
            </div>
          )}
        </Card>

        <Modal modalRef={modalRef}>
          <h4 className="text-lg text-neutral font-bold">Assigned To</h4>

          <ul className="mt-7 list max-h-100 scrollbar">
            <li className="list-row px-0">
              <AssignedTo id={userDetails._id} assignedTo={userDetails} />
            </li>

            {otherUsers.map(({ _id, ...assignedTo }) => (
              <li className="list-row px-0" key={_id}>
                <AssignedTo id={_id} assignedTo={assignedTo} />
              </li>
            ))}
          </ul>
        </Modal>
      </>
    );
  }
}

export default ViewTaskDetails;
