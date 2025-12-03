import React from "react";

import { Form } from "@components";

import { useOutletContext } from "react-router-dom";

function Register() {
  const handleChange = (e) => {};

  return (
    <Form name="Register">
      {/* Username */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Username</span>
        </div>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </label>

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

      {/* Profile Picture */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Profile Picture</span>
        </div>
        <input
          type="file"
          name="profilePic"
          className="file-input file-input-bordered w-full"
          onChange={handleChange}
        />
      </label>
    </Form>
  );
}

export default Register;
