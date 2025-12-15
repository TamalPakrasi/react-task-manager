import { useNavigate, useOutletContext } from "react-router-dom";

import { useAuthContext } from "@contexts/Auth/context";
import jsonToFormdata from "@utils/jsonToFormdata";

import useAlert from "./useAlert";
import useAxios from "./useAxios";

const validate = (fields) => {
  const hasError = Object.values(fields).some((obj) => obj.error);

  if (hasError) {
    throw new Error("Submission failed - Validation Errors");
  }

  const requiredFields = Object.values(fields).filter((obj) => obj.required);

  const isAllFilled =
    requiredFields.length > 0 &&
    requiredFields.every((obj) => obj.value !== "" && obj.value !== null);

  if (!isAllFilled) {
    throw new Error("Submission failed - Fill all required fields");
  }
};

const useForm = ({ api }) => {
  const { formState, formDispatch } = useOutletContext();

  const { authDispatch } = useAuthContext();

  const { error, success } = useAlert();

  const { post } = useAxios(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fields, submit } = formState;

    if (submit.isSubmitting) return;

    try {
      validate(fields);

      formDispatch({ type: "START_SUBMITTING" });

      const { data, message } = await post({
        api,
        data: jsonToFormdata(fields),
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      });

      authDispatch({
        type: "LOGIN",
        payload: {
          token: data.token,
          user: data.user,
        },
      });

      success(message);

      navigate(`/${data.user.role}/dashboard`);
    } catch (err) {
      error(err.message);
    } finally {
      formDispatch({ type: "STOP_SUBMITTING" });
    }
  };

  return { handleSubmit };
};

export default useForm;
