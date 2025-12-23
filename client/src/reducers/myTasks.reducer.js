export const myTasksInitState = {
  isActive: "All",
  statusSummary: {
    all: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  },
  tasks: [],
};

const myTasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_IS_ACTIVE":
      return { ...state, isActive: action.payload.value };

    case "SET_DATA":
      return {
        ...state,
        statusSummary: action.payload.statusSummary,
        tasks: action.payload.tasks,
      };

    default:
      break;
  }
};

export default myTasksReducer;
