import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import useAlert from "./useAlert";

const useForm = (mode, required) => {
  const { formState, formDispatch } = useOutletContext();
  const { error } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { hasError, fields } = formState;
    try {
      if (hasError) {
        throw new Error("Submission failed - Validation Errors");
      }

      const isAllFilled = Object.values(fields).some(
        (obj) => obj.required && obj.value
      );

      if (!isAllFilled) {
        throw new Error("Submission failed - Fill all required fields");
      }

      console.log(mode);
      console.log(formState);

      e.target.reset();
      formDispatch({ type: "RESET" });
    } catch (err) {
      error(err.message);
    }
  };

  return { handleSubmit };
};

export default useForm;
