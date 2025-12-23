export const fetchInitState = {
  isLoading: false,
  isError: false,
  error: "",
  hasFetched: false,
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case "START_FETCHING":
      return { ...fetchInitState, isLoading: true };

    case "STOP_FETCHING":
      return { ...state, isLoading: false, hasFetched: true };

    case "SET_ERROR":
      return {
        ...state,
        isError: true,
        error: action.payload.error,
      };
  }
};

export default fetchReducer;
