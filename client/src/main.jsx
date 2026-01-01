import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

import "@lib/charts";

createRoot(document.getElementById("root")).render(<App />);
