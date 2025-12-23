import { publicApi, privateApi } from "@network/axiosInstance";

const useAxios = (isPrivate = false) => {
  const axiosInstance = isPrivate ? privateApi : publicApi;

  const post = async ({ api, data = null, config = {} }) => {
    try {
      const res = await axiosInstance.post(api, data, config);

      return res.data;
    } catch (error) {
      throw new Error(
        `${error.response.data.statusCode} - ${error.response.data.message}`
      );
    }
  };

  const get = async ({ api, config = {} }) => {
    try {
      const res = await axiosInstance.get(api, config);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const put = async ({ api, data = null, config = {} }) => {
    try {
      const res = await axiosInstance.put(api, data, config);

      return res.data;
    } catch (error) {
      throw new Error(
        `${error.response.data.statusCode} - ${error.response.data.message}`
      );
    }
  };

  return { post, get, put };
};

export default useAxios;
