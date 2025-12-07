import { useNavigate } from "react-router-dom";

import apiPaths from "@network/apiPaths";
import useAxios from "@hooks/useAxios";
import useAlert from "@hooks/useAlert";
import { useAuthContext } from "@contexts/Auth/context";

const useLogout = () => {
  const { post } = useAxios(true);
  const { error, success } = useAlert();

  const { authDispatch } = useAuthContext();

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    try {
      const { message } = await post({
        api: apiPaths.logout,
      });

      authDispatch({
        type: "LOGOUT",
      });

      success(message);

      navigate("/auth/login");
    } catch (err) {
      error(err.message);
    }
  };

  return { handleLogout };
};

export default useLogout;
