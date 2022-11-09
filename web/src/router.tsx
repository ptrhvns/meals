import { createBrowserRouter } from "react-router-dom";
import { homeRouterOpts } from "./routes/Home";
import { notFoundRouterOpts } from "./routes/NotFound";
import { signupRouterOpts } from "./routes/Signup";

// prettier-ignore
export default createBrowserRouter([

  { path: "/", ...homeRouterOpts },
  { path: "/signup", ...signupRouterOpts },

  { path: "*", ...notFoundRouterOpts },
]);
