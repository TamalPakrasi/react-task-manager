import api from "@utils/axiosInstance";

import { useOutletContext } from "react-router-dom";

function Form({ children, name }) {
  const { handleSubmit } = useOutletContext();

  return (
    <form
      className="card w-full max-w-md bg-base-100 shadow-full p-6 space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center">{name}</h2>

      {/* All Form will render here */}
      {children}

      <button className="btn btn-primary w-full mt-4">{name}</button>
    </form>
  );
}

export default Form;
