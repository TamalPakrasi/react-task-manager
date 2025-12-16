import React from "react";
import { Link } from "react-router-dom";
import { Paperclip } from "lucide-react";

import Card from "./Card";

function Task() {
  return (
    <Link to="/member/task-details/1">
      <Card className="shadow-lg">
        <div className="flex gap-3">
          <div className="badge badge-sm badge-soft badge-primary">Pending</div>
          <div className="badge badge-sm badge-soft badge-error">
            High Priority
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-semibold">
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p className="text-xs text-neutral leading-5 mt-1 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil odit,
            quis architecto nam placeat quod? Molestiae sed quo illum
            necessitatibus tempore.
          </p>

          <div className="mt-3">
            <span className="text-[15px]">
              Task Done: <span className="font-bold">3 / 5</span>
              <progress
                className="progress progress-primary w-full"
                value="3"
                max="5"
              ></progress>
            </span>
          </div>
        </div>

        <div className="mt-2 flex-between">
          <div>
            <p className="text-neutral font-medium text-xs">Start Date</p>
            <p className="font-semibold text-xs mt-0.5">December 16, 2025</p>
          </div>

          <div>
            <p className="text-neutral font-medium text-xs">Due Date</p>
            <p className="font-semibold text-xs mt-0.5">December 18, 2025</p>
          </div>
        </div>

        <div className="mt-2 flex-between">
          <div class="avatar-group -space-x-4">
            <div class="avatar">
              <div class="w-7">
                <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
              </div>
            </div>
            <div class="avatar">
              <div class="w-7">
                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
              </div>
            </div>
            <div class="avatar">
              <div class="w-7">
                <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
              </div>
            </div>
            <div class="avatar avatar-placeholder">
              <div class="bg-neutral text-neutral-content w-7">
                <span>+3</span>
              </div>
            </div>
          </div>

          <button class="btn btn-sm btn-primary btn-soft">
            <Paperclip size={15} /> <span className="text-black">2</span>
          </button>
        </div>
      </Card>
    </Link>
  );
}

export default Task;
