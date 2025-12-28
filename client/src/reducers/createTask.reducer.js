import validateTask from "@utils/validateTask";

export const createTaskInitState = {
  data: {
    title: { value: "", error: null },
    description: { value: "", error: null },
    priority: { value: "", error: null },
    dueDate: { value: "", error: null },
    assignedTo: { value: [], error: null },
    taskCheckList: { value: [], error: null },
    attachments: [],
  },

  submit: {
    isSubmitting: false,
    success: false,
    hasValidationErrors: false,
  },

  errors: [],
};

const createTaskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK_TO_LIST":
      const { task } = action.payload;

      if (state.data.taskCheckList.value.includes(task)) {
        return { ...state, errors: [...state.errors, "Task Already Exists"] };
      }

      return {
        ...state,
        errors: [],
        data: {
          ...state.data,
          taskCheckList: {
            ...state.data.taskCheckList,
            value: [...state.data.taskCheckList.value, task],
          },
        },
      };

    case "REMOVE_TASK_FROM_LIST":
      return {
        ...state,
        errors: [],
        data: {
          ...state.data,
          taskCheckList: {
            ...state.data.taskCheckList,
            value: state.data.taskCheckList.value.filter(
              (task) => task !== action.payload.task
            ),
          },
        },
      };

    case "ADD_ATTACHMENTS":
      const { attachment } = action.payload;

      if (state.data.attachments.includes(attachment)) {
        return {
          ...state,
          errors: [...state.errors, "Attachement Already Exists"],
        };
      }

      return {
        ...state,
        errors: [],
        data: {
          ...state.data,
          attachments: [...state.data.attachments, attachment],
        },
      };

    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        errors: [],
        data: {
          ...state.data,
          attachments: state.data.attachments.filter(
            (attachment) => attachment !== action.payload.attachment
          ),
        },
      };

    case "SET_VALUE":
      const { name, value } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [name]: { ...state.data[name], error: null, value },
        },
      };

    case "ADD_TO_ASSIGNED_TO":
      return {
        ...state,
        data: {
          ...state.data,
          assignedTo: {
            ...state.data.assignedTo,
            value: [...state.data.assignedTo.value, action.payload.id],
          },
        },
      };

    case "REMOVE_FROM_ASSIGNED_TO":
      return {
        ...state,
        data: {
          ...state.data,
          assignedTo: {
            ...state.data.assignedTo,
            value: state.data.assignedTo.value.filter(
              (id) => id !== action.payload.id
            ),
          },
        },
      };

    case "VALIDATE":
      const updatedData = Object.fromEntries(
        Object.entries(state.data).map(([field, value]) => {
          const data = value?.value
            ? { value: value.value, error: null }
            : value;
          return [field, data];
        })
      );

      const errors = validateTask(state.data);

      if (errors.length > 0) {
        errors.forEach((error) => {
          const [field, err] = Object.entries(error).flat();
          updatedData[field].error = err;
        });
      }

      return errors.length > 0
        ? {
            ...state,
            data: updatedData,
            submit: { ...state.submit, hasValidationErrors: true },
          }
        : {
            ...state,
            data: updatedData,
            submit: {
              ...state.submit,
              isSubmitting: true,
              hasValidationErrors: false,
            },
          };

    case "STOP_SUBMITTING":
      return {
        ...state,
        submit: {
          ...state.submit,
          isSubmitting: false,
        },
      };

    case "CLEAR_FORM":
      return {
        ...state,
        submit: { ...state.submit, success: true },
        data: { ...createTaskInitState.data },
      };
  }
};

export default createTaskReducer;
