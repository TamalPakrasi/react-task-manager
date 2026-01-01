import { Outlet } from "react-router-dom";

// auth context
import AuthContextProvider from "@contexts/Auth/Provider";

// toast
import ToastProvider from "@lib/ToastProvider";

// interceptor
import AxiosInterceptor from "@network/AxiosInterceptor";

function AppLayout() {
  return (
    <ToastProvider>
      <AuthContextProvider>
        <AxiosInterceptor />
        <Outlet />
      </AuthContextProvider>
    </ToastProvider>
  );
}

export default AppLayout;
