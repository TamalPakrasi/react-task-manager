import { Suspense, useReducer, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { Loader } from "@components";

import formReducer, { initFormState } from "@reducers/form.reducer";

import ToastProvider from "@lib/ToastProvider";

function AuthLayout() {
  const [formState, formDispatch] = useReducer(formReducer, initFormState);

  // event handler (onChange)
  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;

    const toSend = type === "file" ? files[0] : value.trim();

    formDispatch({
      type: "UPDATE_FIELD",
      payload: { name, value: toSend },
    });
  }, []);

  // context
  const context = useMemo(
    () => ({ formState, handleChange, formDispatch }),
    [formState, handleChange, formDispatch]
  );

  return (
    <ToastProvider>
      <Suspense fallback={<Loader size="lg" />}>
        <Outlet context={context} />
      </Suspense>
    </ToastProvider>
  );
}

export default AuthLayout;
