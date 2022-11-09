import ErrorPage from "../components/ErrorPage";
import HomeHero from "../components/HomeHero";
import Navbar from "../components/Navbar";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{buildTitle()}</title>
      </Helmet>

      <Navbar />
      <HomeHero />
    </>
  );
}

export const homeRouterOpts = {
  element: <Home />,
  errorElement: <ErrorPage />,
};
