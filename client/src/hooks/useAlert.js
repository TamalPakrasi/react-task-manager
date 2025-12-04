import React from "react";
import { toast } from "react-toastify";

function useAlert() {
  const alert = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast.info(msg),
    warn: (msg) => toast.warn(msg),
  };

  return alert;
}

export default useAlert;
