import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import {siteConfig} from './config/ICAR-Config.jsx'

// Set the dynamic title
document.title = siteConfig.siteName;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate}>
      <App />
    </AlertProvider>
  </React.StrictMode>
);
