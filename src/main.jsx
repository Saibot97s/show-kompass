import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "/src/styles.css";

// Polyfills für Browser sonst wieder entfernen
import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;
if (!window.process) window.process = { env: {} };


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);