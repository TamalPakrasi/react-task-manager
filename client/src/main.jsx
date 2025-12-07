import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

// auth context
import AuthContextProvider from "@contexts/Auth/Provider";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
