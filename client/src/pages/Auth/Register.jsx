import { useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

import { Form, EmailPass } from "@components";

import apiPaths from "@network/apiPaths";

function Register() {
  const { handleChange, formDispatch, formState } = useOutletContext();

  const { fields } = formState;

  const defaultState = [
    { name: "username", value: "", required: true },
    { name: "email", value: "", required: true },
    { name: "password", value: "", required: true },
    { name: "profilePic", value: null, required: false },
  ];

  useEffect(() => {
    formDispatch({
      type: "REGISTER_NEW_FIELDS",
      payload: {
        fields: defaultState,
      },
    });

    return () => {
      formDispatch({ type: "RESET" });
    };
  }, []);

  return (
    <>
      <Form name="Register" api={apiPaths.register} defaultState={defaultState}>
        {/* Username */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={fields?.username?.value || ""}
            className={`input ${
              fields?.username?.error ? "border-red-500 outline-red-500" : ""
            } w-full`}
            onChange={handleChange}
          />
          {fields?.username?.error && (
            <div className="text-red-500 text-sm mt-1">
              {fields.username.error}
            </div>
          )}
        </label>

        <EmailPass />

        {/* Profile Picture */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">
              Profile Picture <span className="text-sm">(optional)</span>
            </span>
          </div>
          <input
            type="file"
            name="profilePic"
            className="file-input file-input-bordered w-full"
            onChange={handleChange}
            accept="image/*"
          />
          {fields?.profilePic?.error && (
            <div className="text-red-500 text-sm mt-1">
              {fields.profilePic.error}
            </div>
          )}
        </label>
      </Form>

      <p className="mt-4 font-medium">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary select-none">
          Log In
        </Link>
      </p>
    </>
  );
}

export default Register;
