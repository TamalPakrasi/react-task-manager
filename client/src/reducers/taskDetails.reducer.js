export const taskDetailsInitState = {
  task: null,
  list: [],
};

const taskDetailsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASK":
      return {
        ...state,
        task: action.payload.task,
        list: action.payload.task.taskCheckList,
      };

    case "SET_TASK_LIST":
      return {
        ...state,
        task: { ...state.task, status: action.payload.status },
        list: action.payload.list,
      };
  }
};

export default taskDetailsReducer;
