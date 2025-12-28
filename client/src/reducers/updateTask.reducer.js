import validateTask from "@utils/validateTask";

export const updateTaskInitState = {
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
    hasValidationErrors: false,
  },

  errors: [],
};

const updateTaskReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      const {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        taskCheckList,
        attachments,
      } = action.payload.data;

      return {
        ...state,
        data: {
          ...state.data,
          title: { error: null, value: title },
          description: { error: null, value: description },
          priority: { error: null, value: priority.toLowerCase() },
          dueDate: {
            error: null,
            value: new Date(dueDate).toISOString().slice(0, 10),
          },
          assignedTo: { error: null, value: assignedTo.map(({ _id }) => _id) },
          taskCheckList: {
            error: null,
            value: taskCheckList,
          },
          attachments,
        },
      };

    case "CHANGE_DATA":
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
            error: null,
            value: [...state.data.assignedTo.value, action.payload.id],
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

    case "REMOVE_FROM_ASSIGNED_TO":
      return {
        ...state,
        data: {
          ...state.data,
          assignedTo: {
            error: null,
            value: state.data.assignedTo.value.filter(
              (id) => id !== action.payload.id
            ),
          },
        },
      };

    case "ADD_TO_TASK_CHECKLIST":
      const { task } = action.payload;

      const exists = state.data.taskCheckList.value.some(
        ({ text }) => text === task
      );

      if (exists)
        return {
          ...state,
          errors: [...state.errors, "Task Already Exists"],
        };

      return {
        ...state,
        errors: [],
        data: {
          ...state.data,
          taskCheckList: {
            error: null,
            value: [
              ...state.data.taskCheckList.value,
              { text: task, completed: false },
            ],
          },
        },
      };

    case "REMOVE_FROM_TASK_CHECKLIST":
      return {
        ...state,
        data: {
          ...state.data,
          taskCheckList: {
            ...state.data.taskCheckList,
            value: state.data.taskCheckList.value.filter(
              ({ text }) => text !== action.payload.text
            ),
          },
        },
      };

    case "ADD_ATTACHMENT":
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
        data: {
          ...state.data,
          attachments: state.data.attachments.filter(
            (attachment) => attachment !== action.payload.attachment
          ),
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
  }
};

export default updateTaskReducer;
