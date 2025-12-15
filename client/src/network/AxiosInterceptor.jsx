import { useEffect } from "react";

import { privateApi } from "./axiosInstance";
import apiPaths from "./apiPaths";

import { useAuthContext } from "@contexts/Auth/context";
import useAxios from "@hooks/useAxios";
import useLogout from "@hooks/useLogout";

function AxiosInterceptor() {
  const { authDispatch, token } = useAuthContext();
  const { post } = useAxios(true);

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
        const originalRequest = err.config;

        if (originalRequest.url.includes(apiPaths.refresh)) {
          await handleLogout();
          return Promise.reject(err);
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data } = await post({
              api: apiPaths.refresh,
            });

            console.log(data);

            authDispatch({
              type: "REFRESH",
              payload: {
                new_token: data.token,
              },
            });

            originalRequest.headers.Authorization = `Bearer ${data.token}`;
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
