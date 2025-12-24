import { useFetchContext } from "@contexts/Fetch/context";
import useAxios from "./useAxios";

function useGetUserDashboardData() {
  const { fetchDispatch } = useFetchContext();

  const { get } = useAxios(true);

  const getUserDashboardData = async () => {
    fetchDispatch({ type: "START_FETCHING" });

    try {
      const { data } = await get({ api: "/dashboard/summary" });

      return data;
    } catch (error) {
      fetchDispatch({
        type: "SET_ERROR",
        payload: { error: error.message },
      });
    } finally {
      fetchDispatch({ type: "STOP_FETCHING" });
    }
  };

  return { getUserDashboardData };
}

export default useGetUserDashboardData;
