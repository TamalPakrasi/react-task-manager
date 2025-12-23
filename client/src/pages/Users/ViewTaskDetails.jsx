import { useRef } from "react";

import {
  Card,
  TaskChecklist,
  Attachments,
  Modal,
  AssignedTo,
} from "@components";

function ViewTaskDetails() {
  const modalRef = useRef(null);

  return (
    <>
      <Card className="max-w-200">
        <div className="flex-between">
          <h2 className="font-semibold text-base">
            Lorem ipsum dolor sit amet.
          </h2>
          <div className="badge badge-soft badge-primary text">Pending</div>
        </div>

        <div className="mt-3">
          <h4 className="text-xs text-neutral font-medium">Description</h4>
          <p className="mt-0.5 leading-5 font-semibold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
            inventore velit deserunt aliquam nobis optio, beatae nulla quae
            animi tempora temporibus placeat hic!
          </p>
        </div>

        <div className="mt-2 flex-between">
          <div>
            <h4 className="text-xs text-neutral font-medium">Priority</h4>
            <span className="mt-0.5 font-semibold">High</span>
          </div>

          <div>
            <h4 className="text-xs text-neutral font-medium">Due Date</h4>
            <span className="mt-0.5 font-semibold">March 31, 2026</span>
          </div>

          <div>
            <h4 className="text-xs text-neutral font-medium">Assigned To</h4>
            <div
              className="avatar-group -space-x-3 mt-0.5 cursor-pointer"
              onClick={() => modalRef.current && modalRef.current.showModal()}
            >
              <div className="avatar">
                <div className="w-7">
                  <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-7">
                  <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                </div>
              </div>
              <div className="avatar">
                <div className="w-7">
                  <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
                </div>
              </div>
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-7">
                  <span>+3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-xs text-neutral font-medium">Task Checklist</h4>
          <TaskChecklist />
        </div>

        <div className="mt-3">
          <h4 className="text-xs text-neutral font-medium">Attachments</h4>
          <Attachments />
        </div>
      </Card>

      <Modal modalRef={modalRef}>
        <h4 className="text-lg text-neutral font-bold">Assigned To</h4>

        <ul className="mt-7 list max-h-100 scrollbar">
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
          <li className="list-row px-0">
            <AssignedTo />
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default ViewTaskDetails;
