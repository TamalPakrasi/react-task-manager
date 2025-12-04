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
    case "REGISTER_FIELDS":
      const newFields = { ...state.fields };

      action.payload.fields.forEach(({ name, value, required }) => {
        newFields[name] = {
          value,
          required,
          error: null,
        };
      });

      return {
        ...state,
        fields: newFields,
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

      const errors = Object.entries(
        validation({
          field: name,
          value,
        })
      );

      if (errors.length > 0) {
        errors.forEach(([field, err]) => {
          updatedFields[field].error = err;
        });
      } else {
        updatedFields[name].error = null;
      }

      return { ...state, fields: updatedFields };

    case "RESET":
      return initFormState;

    case "RESET_FIELDS":
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
    default:
      break;
  }
};

export default form;
