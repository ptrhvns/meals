import "./styles/main.module.scss";
import App from "./routes/App";
import AuthnProvider from "./providers/AuthnProvider";
import Dashboard from "./routes/Dashboard";
import ErrorPage from "./components/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import React from "react";
import Signup from "./routes/Signup";
import SignupConfirmation from "./routes/SignupConfirmation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-confirmation/:token", element: <SignupConfirmation /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthnProvider>
        <RouterProvider router={router} />
      </AuthnProvider>
    </HelmetProvider>
  </React.StrictMode>
);
