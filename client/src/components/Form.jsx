import { LogIn, UserPlus } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import useForm from "@hooks/useForm";

function Form({ children, name, api }) {
  const { handleSubmit } = useForm({ api });

  const { formState } = useOutletContext();

  return (
    <form className="auth-form shadow-full" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">{name}</h2>

      {/* All Form will render here */}
      {children}

      <button
        className="btn btn-primary w-full mt-4"
        disabled={formState.submit.isSubmitting}
      >
        {formState.submit.isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            {name === "Register" ? <UserPlus size={20} /> : <LogIn size={20} />}
            {name}
          </>
        )}
      </button>
    </form>
  );
}

export default Form;
