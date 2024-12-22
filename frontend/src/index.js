import React from "react";
import ReactDOM from "react-dom/client"; // Cambia a react-dom/client
import App from "./App";
import { TimerProvider } from "./context/TimerContext";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById("root")); // Usa createRoot
root.render(
  <React.StrictMode>
    <TimerProvider>
      <App />
    </TimerProvider>
  </React.StrictMode>
);
