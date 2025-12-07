import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function EmailPass() {
  const [show, setShow] = useState(false);
  const { formState, handleChange } = useOutletContext();

  console.log(formState);

  const { fields } = formState;

  return (
    <>
      {/* Email */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          type="text"
          name="email"
          placeholder="Enter email"
          value={fields?.email?.value || ""}
          className={`input ${
            fields?.email?.error ? "border-red-500 outline-red-500" : ""
          } w-full`}
          onChange={handleChange}
        />

        {fields?.email?.error && (
          <div className="text-red-500 text-sm mt-1">{fields.email.error}</div>
        )}
      </label>

      {/* Password */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="password"
            value={fields?.password?.value || ""}
            placeholder="Enter password"
            className={`input ${
              fields?.password?.error ? "border-red-500 outline-red-500" : ""
            } w-full`}
            onChange={handleChange}
          />
          <span
            className="absolute right-2.5 top-2.5 cursor-pointer z-20"
            onClick={() => setShow((p) => !p)}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {fields?.password?.error && (
          <div className="text-red-500 text-sm mt-1">
            {fields.password.error}
          </div>
        )}
      </label>
    </>
  );
}

export default EmailPass;
