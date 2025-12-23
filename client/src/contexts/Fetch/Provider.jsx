import { useReducer } from "react";

import fetchReducer, { fetchInitState } from "@reducers/fetch.reducer";

import { FetchContext } from "./context";

function Provider({ children }) {
  const [fetchState, fetchDispatch] = useReducer(fetchReducer, fetchInitState);

  return (
    <FetchContext.Provider
      value={{
        ...fetchState,
        fetchDispatch,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}

export default Provider;
