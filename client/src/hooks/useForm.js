import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import useAlert from "./useAlert";

const useForm = ({ mode, defaultState }) => {
  const { formState, formDispatch } = useOutletContext();
  const { error } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fields } = formState;
    console.log(fields);

    try {
      const hasError = Object.values(fields).some((obj) => obj.error);

      if (hasError) {
        throw new Error("Submission failed - Validation Errors");
      }

      const requiredFields = Object.values(fields).filter(
        (obj) => obj.required
      );

      const isAllFilled =
        requiredFields.length > 0 && requiredFields.every((obj) => obj.value);

      console.log(isAllFilled);

      if (!isAllFilled) {
        throw new Error("Submission failed - Fill all required fields");
      }

      console.log(mode);
      console.log(formState);

      e.target.reset();
      formDispatch({ type: "RESET_FIELDS", payload: { fields: defaultState } });
    } catch (err) {
      error(err.message);
    }
  };

  return { handleSubmit };
};

export default useForm;
