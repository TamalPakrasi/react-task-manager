import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

// auth context
import AuthContextProvider from "@contexts/Auth/Provider";

// toast
import ToastProvider from "@lib/ToastProvider";

import "@lib/charts";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ToastProvider>
);
