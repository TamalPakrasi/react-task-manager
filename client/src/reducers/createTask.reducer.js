export const createTaskInitState = {
  data: {
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: [],
    taskCheckList: [],
    attachments: [],
  },

  error: [],
};

const createTaskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK_TO_LIST":
      const { task } = action.payload;

      if (state.data.taskCheckList.includes(task)) {
        return { ...state, error: [...state.error, "Task Already Exists"] };
      }

      return {
        ...state,
        error: [],
        data: {
          ...state.data,
          taskCheckList: [...state.data.taskCheckList, task],
        },
      };

    case "REMOVE_TASK_FROM_LIST":
      return {
        ...state,
        error: [],
        data: {
          ...state.data,
          taskCheckList: state.data.taskCheckList.filter(
            (task) => task !== action.payload.task
          ),
        },
      };

    case "ADD_ATTACHMENTS":
      const { attachment } = action.payload;

      if (state.data.attachments.includes(attachment)) {
        return {
          ...state,
          error: [...state.error, "Attachement Already Exists"],
        };
      }

      return {
        ...state,
        error: [],
        data: {
          ...state.data,
          attachments: [...state.data.attachments, attachment],
        },
      };

    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        error: [],
        data: {
          ...state.data,
          attachments: state.data.attachments.filter(
            (attachment) => attachment !== action.payload.attachment
          ),
        },
      };

    case "SET_VALUE":
      let { name, value } = action.payload;

      if (name === "dueDate") value = new Date(value);

      return { ...state, data: { ...state.data, [name]: value } };

    case "ADD_TO_ASSIGNED_TO":
      return {
        ...state,
        data: {
          ...state.data,
          assignedTo: [...state.data.assignedTo, action.payload.id],
        },
      };

    case "REMOVE_FROM_ASSIGNED_TO":
      return {
        ...state,
        data: {
          ...state.data,
          assignedTo: state.data.assignedTo.filter(
            (id) => id !== action.payload.id
          ),
        },
      };
  }
};

export default createTaskReducer;
