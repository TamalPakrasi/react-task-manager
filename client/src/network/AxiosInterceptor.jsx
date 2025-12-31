import { useEffect } from "react";

import { privateApi, publicApi } from "./axiosInstance";
import apiPaths from "./apiPaths";

import { useAuthContext } from "@contexts/Auth/context";
import useLogout from "@hooks/useLogout";

function AxiosInterceptor() {
  const { authDispatch, token } = useAuthContext();

  const { handleLogout } = useLogout();

  useEffect(() => {
    if (!token) return;

    const reqInterceptor = privateApi.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    });

    const resInterceptor = privateApi.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err?.config;

        if (originalRequest.url.includes(apiPaths.refresh)) {
          await handleLogout();
          return Promise.reject(err);
        }

        if (err?.response?.status === 403) await handleLogout();
        else if (err?.response?.status === 401 && !originalRequest?.sent) {
          originalRequest.sent = true;

          try {
            const { data: axiosData } = await publicApi.post(apiPaths.refresh);

            const { data } = axiosData;

            authDispatch({
              type: "REFRESH",
              payload: {
                new_token: data.token,
              },
            });

            originalRequest.headers["Authorization"] = `Bearer ${data.token}`;

            return privateApi(originalRequest);
          } catch (error) {
            await handleLogout();

            return Promise.reject(error);
          }
        }

        return Promise.reject(err);
      }
    );

    return () => {
      privateApi.interceptors.request.eject(reqInterceptor);
      privateApi.interceptors.response.eject(resInterceptor);
    };
  }, [token]);

  return null;
}

export default AxiosInterceptor;
