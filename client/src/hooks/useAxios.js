import { publicApi, privateApi } from "@network/axiosInstance";

const useAxios = (isPrivate = false) => {
  const axiosInstance = isPrivate ? privateApi : publicApi;

  const post = async ({ api, data, config = {} }) => {
    try {
      const res = await axiosInstance.post(api, data, config);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { post };
};

export default useAxios;
