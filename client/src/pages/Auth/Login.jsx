import React from "react";

import { Form } from "@components";

function Login() {
  const handleChange = (e) => {}

  return (
    <Form name="Log in">
      {/* Email */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </label>

      {/* Password */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </label>
    </Form>
  );
}

export default Login;
