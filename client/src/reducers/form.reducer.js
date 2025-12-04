import validation from "@utils/validation";

export const initFormState = {
  fields: {},
  submit: {
    success: false,
    isLoading: false,
    isError: false,
  },
};

const form = (state, action) => {
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
    default:
      break;
  }
};

export default form;
