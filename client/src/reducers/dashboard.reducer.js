export const dashboardInitState = {
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

const dashboardReducer = (state, action) => {
  switch (action.type) {
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

export default dashboardReducer;
