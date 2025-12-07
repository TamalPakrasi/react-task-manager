import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { privateApi } from "./axiosInstance";
import apiPaths from "./apiPaths";

import { useAuthContext } from "@contexts/Auth/context";
import useAxios from "@hooks/useAxios";

function AxiosInterceptor() {
  const { authDispatch, token } = useAuthContext();
  const { post } = useAxios();

  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = privateApi.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    const resInterceptor = privateApi.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data } = await post({
              api: apiPaths.refresh,
              data: null,
            });

            authDispatch({
              type: "REFRESH",
              payload: {
                new_token: data.token,
              },
            });

            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return privateApi(originalRequest);
          } catch (error) {
            authDispatch({
              type: "LOGOUT",
            });

            navigate("/auth/login");
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
  }, []);

  return null;
}

export default AxiosInterceptor;
