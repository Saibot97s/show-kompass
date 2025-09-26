// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "/src/styles.css";

// Polyfills (falls nötig)
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;
if (!window.process) window.process = { env: {} };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* nutzt in dev '/' und im Build den Wert aus vite.config.js */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
