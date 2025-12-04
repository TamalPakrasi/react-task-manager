import validation from "@utils/validation";

export const initFormState = {
  fields: {},
  submit: {
    success: false,
    isLoading: false,
    isError: false,
  },
  hasError: false,
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

    case "UPDATE_FIELD": {
      const { name, value } = action.payload;

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...(state.fields[name] || { errors: null }),
          value,
        },
      };

      const errors = validation({
        field: name,
        value,
      });

      if (Object.keys(errors).length > 0) {
        return {
          ...state,
          hasError: true,
          fields: Object.entries(updatedFields).reduce((acc, [field, obj]) => {
            acc[field] = {
              ...obj,
              error: errors[field] || null,
            };
            return acc;
          }, {}),
        };
      }

      return {
        ...state,
        hasError: false,
        fields: {
          ...updatedFields,
          [name]: {
            ...updatedFields[name],
            error: null,
          },
        },
      };
    }

    case "RESET":
      return initFormState;
    default:
      break;
  }
};

export default form;
