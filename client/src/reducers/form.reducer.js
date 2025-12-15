import validation from "@utils/validation";

export const initFormState = {
  fields: {},
  submit: {
    success: false,
    isSubmitting: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_NEW_FIELDS":
      return {
        ...state,
        fields: action.payload.fields.reduce((acc, curr) => {
          acc[curr.name] = {
            value: curr.value,
            required: curr.required,
            error: null,
          };
          return acc;
        }, {}),
      };

    case "UPDATE_FIELD":
      const { name, value } = action.payload;

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          value,
        },
      };

      const error = validation({
        field: name,
        value,
      });

      updatedFields[name].error = error.length > 0 ? error : null;

      return { ...state, fields: updatedFields };

    case "RESET":
      return initFormState;

    case "START_SUBMITTING":
      return {
        ...state,
        submit: { success: false, isSubmitting: true },
      };

    case "STOP_SUBMITTING":
      return { ...state, submit: { ...state.submit, isSubmitting: false } };

    default:
      break;
  }
};

export default reducer;
