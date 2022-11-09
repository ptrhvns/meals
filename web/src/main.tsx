import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import "./styles/main.module.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
