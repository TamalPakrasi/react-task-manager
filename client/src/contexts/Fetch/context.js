import { createContext, useContext } from "react";

import { fetchInitState } from "@reducers/fetch.reducer";

export const FetchContext = createContext({
  ...fetchInitState,
  fetchDispatch: () => {},
});

export const useFetchContext = () => useContext(FetchContext);
