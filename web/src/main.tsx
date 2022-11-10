import App from "./routes/App";
import ErrorPage from "./components/ErrorPage";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import React from "react";
import ReactDOM from "react-dom/client";
import Signup from "./routes/Signup";
import { createBrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import "./styles/main.module.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <Signup /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
