import useForm from "@hooks/useForm";

function Form({ children, name, api, defaultState }) {
  const { handleSubmit } = useForm({ api, defaultState });

  return (
    <form className="auth-form shadow-full" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center">{name}</h2>

      {/* All Form will render here */}
      {children}

      <button className="btn btn-primary w-full mt-4">{name}</button>
    </form>
  );
}

export default Form;
