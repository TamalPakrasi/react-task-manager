import { useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

import { Form, EmailPass } from "@components";

function Login() {
  const { formDispatch } = useOutletContext();

  useEffect(() => {
    formDispatch({
      type: "REGISTER_FIELDS",
      payload: {
        fields: [
          { name: "email", value: "", required: true },
          { name: "password", value: "", required: true },
        ],
      },
    });

    return () => {
      formDispatch({ type: "RESET" });
    };
  }, []);

  return (
    <>
      <Form name="Log in" mode="login">
        <EmailPass />
      </Form>

      <p className="mt-4 font-medium">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-primary select-none">
          Register
        </Link>
      </p>
    </>
  );
}

export default Login;
