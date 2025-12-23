import React from "react";
import { X } from "lucide-react";

function Modal({ children, modalRef }) {
  return (
    <dialog ref={modalRef} className="modal select-none">
      <div className="modal-box bg-base-200">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-0">
            <X size={20} />
          </button>
        </form>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default Modal;
