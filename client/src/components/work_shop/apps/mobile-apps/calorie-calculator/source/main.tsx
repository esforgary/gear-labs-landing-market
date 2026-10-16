import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeTheme } from "./theme";
import "./styles.css";
import "./refinements.css";
import "./theme.css";
import "./phone.css";
initializeTheme();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
