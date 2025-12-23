export const memberInitState = {
  isLoading: false,
  isError: false,
  error: "",
  hasFetched: false,
  data: {
    stats: {
      all: 0,
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    },
    dist: {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    },
    priority: {
      Low: 0,
      Medium: 0,
      High: 0,
    },
    tasks: [],
  },
};

const memberReducer = (state, action) => {
  switch (action.type) {
    case "START_FETCHING":
      return { ...state, isLoading: true, isError: false, hasFetched: false };

    case "STOP_FETCHING":
      return { ...state, isLoading: false, hasFetched: true };

    case "SET_ERROR":
      return {
        ...state,
        isError: true,
        error: action.payload.error,
      };

    case "SET_DATA":
      return {
        ...state,
        data: {
          stats: action.payload.data.statistics,
          dist: action.payload.data.charts.status,
          priority: action.payload.data.charts.priority,
          tasks: action.payload.data.recentTasks,
        },
      };
  }
};

export default memberReducer;
