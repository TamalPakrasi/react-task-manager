import React from "react";
import { Link } from "react-router-dom";
import { Paperclip } from "lucide-react";

import Card from "./Card";
import Image from "./Image";

import { useAuthContext } from "@contexts/Auth/context";

import formatCreatedAt from "@utils/formateCreatedAt";
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
} from "@utils/getTaskClasses";

function Task({ id, task }) {
  const calculateProgress = () =>
    Math.round((task.progress * task.taskCheckList.length) / 100);

  const { user } = useAuthContext();

  let userDetails;

  if (user.role === "member")
    userDetails = task.assignedTo.find(({ _id }) => _id === user._id);

  const otherUsers =
    user.role === "member"
      ? task.assignedTo.filter(({ _id }) => _id !== user._id)
      : task.assignedTo;

  const groupAvatars =
    user.role === "member" ? otherUsers?.slice(0, 2) : otherUsers?.slice(0, 3);

  return (
    <Link
      to={
        user.role === "member"
          ? `/member/task-details/${id}`
          : `/admin/update-task/${id}`
      }
    >
      <Card className="shadow-lg">
        <div className="flex gap-3">
          <div
            className={`badge badge-sm badge-soft ${getStatusBadgeClass(
              task.status,
              task.isOverDue
            )}`}
          >
            {task.isOverDue ? "OverDue" : task.status}
          </div>
          <div
            className={`badge badge-sm badge-soft ${getPriorityBadgeClass(
              task.priority
            )}`}
          >
            {task.priority} Priority
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-semibold wrap-break-word">
            {task.title?.slice(0, 50)}
          </h2>
          <p className="text-xs text-neutral leading-5 mt-1 text-justify wrap-break-word">
            {task.description?.slice(0, 75)}
          </p>

          <div className="mt-3">
            <span className="text-[15px]">
              Task Done:{" "}
              <span className="font-bold">
                {calculateProgress()} / {task.taskCheckList.length}
              </span>
              <progress
                className="progress progress-primary w-full"
                value={calculateProgress()}
                max={task.taskCheckList.length}
              ></progress>
            </span>
          </div>
        </div>

        <div className="mt-2 flex-between">
          <div>
            <p className="text-neutral font-medium text-xs">Start Date</p>
            <p className="font-semibold text-xs mt-0.5">
              {formatCreatedAt(task.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-neutral font-medium text-xs">Due Date</p>
            <p className="font-semibold text-xs mt-0.5">
              {formatCreatedAt(task.dueDate)}
            </p>
          </div>
        </div>

        <div className="mt-2 flex-between">
          <div className="avatar-group -space-x-4">
            {userDetails && (
              <div className="avatar">
                <div className="w-7">
                  <Image img={userDetails.profileImageUrl} />
                </div>
              </div>
            )}

            {groupAvatars.map(({ _id, profileImageUrl = null }) => (
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

          {task.attachments?.length > 0 && (
            <button className="btn btn-sm btn-primary btn-soft">
              <Paperclip size={15} />{" "}
              <span className="text-black">{task.attachments.length}</span>
            </button>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default Task;
