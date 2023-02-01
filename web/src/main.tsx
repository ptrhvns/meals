import "./styles/main.module.scss";
import "@smastrom/react-rating/style.css";
import App from "./routes/App";
import AuthnProvider from "./providers/AuthnProvider";
import Dashboard from "./routes/Dashboard";
import ErrorPage from "./components/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import RatingEdit from "./routes/RatingEdit";
import React from "react";
import Recipe from "./routes/Recipe";
import RecipeNew from "./routes/RecipeNew";
import RecipeTitleEdit from "./routes/RecipeTitleEdit";
import Settings from "./routes/Settings";
import Signup from "./routes/Signup";
import SignupConfirmation from "./routes/SignupConfirmation";
import TagEdit from "./routes/TagEdit";
import TagForRecipeNew from "./routes/TagForRecipeNew";
import TagNew from "./routes/TagNew";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider as WrapBalancerProvider } from "react-wrap-balancer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard/:activeTab?", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "recipe/:recipeId", element: <Recipe /> },
      { path: "recipe/:recipeId/rating/edit", element: <RatingEdit /> },
      { path: "recipe/:recipeId/tag/new", element: <TagForRecipeNew /> },
      { path: "recipe/:recipeId/title/edit", element: <RecipeTitleEdit /> },
      { path: "recipe/new", element: <RecipeNew /> },
      { path: "settings", element: <Settings /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-confirmation/:token", element: <SignupConfirmation /> },
      { path: "tag/:tagId/edit", element: <TagEdit /> },
      { path: "tag/new", element: <TagNew /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <WrapBalancerProvider>
        <AuthnProvider>
          <RouterProvider router={router} />
        </AuthnProvider>
      </WrapBalancerProvider>
    </HelmetProvider>
  </React.StrictMode>
);
