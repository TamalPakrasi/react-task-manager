import { useRef } from "react";

import { Users, Plus, Trash2, Paperclip } from "lucide-react";

import { Card, Modal, AssignedTo } from "@components";

function CreateTask() {
  const formModalRef = useRef(null);

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
              placeholder="Enter Task Title..."
              className={`input w-full mt-2 leading-5 font-medium `}
            />
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs text-neutral font-medium">Description</h4>
            <textarea
              name="description"
              placeholder="Enter Task Description..."
              className={`textarea w-full mt-2 leading-5 font-medium`}
            ></textarea>
          </div>

          <div>
            <h4 className="text-xs text-neutral font-medium">Priority</h4>
            <select
              defaultValue="Choose Priority"
              className={`select w-full mt-2`}
            >
              <option disabled={true}>Choose Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <h4 className="text-xs text-neutral font-medium">Due Date</h4>
            <input type="date" className="input w-full mt-2" />
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

          <div className="md:col-span-3">
            <h4 className="text-xs text-neutral font-medium">Task Checklist</h4>

            <ul className="list gap-2 mt-2">
              <li className="list-row bg-neutral/15">
                01 <span>Hello</span>
              </li>
              <li className="list-row bg-neutral/15">
                02 <span>Hello</span>
              </li>
              <li className="list-row bg-neutral/15">
                02 <span>Hello</span>
              </li>
              <li className="list-row bg-neutral/15">
                02 <span>Hello</span>
              </li>
              <li className="list-row bg-neutral/15">
                02 <span>Hello</span>
                <button className="float-end btn btn-xs btn-ghost">
                  <Trash2 size={15} color="red" />
                </button>
              </li>
            </ul>

            <div className="relative mt-2">
              <input
                type="text"
                name="title"
                placeholder="Enter Task..."
                className={`input w-full mt-2 leading-5 font-medium `}
              />

              <button
                type="button"
                className="btn btn-xs btn-secondary absolute top-4 right-3"
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs text-neutral font-medium">
              Add Attachments
            </h4>

            <ul className="list gap-2 mt-2">
              <li className="list-row bg-neutral/15 items-center">
                <Paperclip size={15} />{" "}
                <span className="font-semibold">Hello</span>{" "}
                <button className="float-end btn btn-xs btn-ghost">
                  <Trash2 size={15} color="red" />
                </button>
              </li>
              <li className="list-row bg-neutral/15 items-center">
                <Paperclip size={15} />{" "}
                <span className="font-semibold">Hello</span>{" "}
                <button className="float-end btn btn-xs btn-ghost">
                  <Trash2 size={15} color="red" />
                </button>
              </li>
            </ul>

            <div className="relative mt-2">
              <input
                type="text"
                name="title"
                placeholder="Enter Link..."
                className={`input w-full mt-2 leading-5 font-medium `}
              />

              <button
                type="button"
                className="btn btn-xs btn-secondary absolute top-4 right-3"
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
