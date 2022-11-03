// import HomeHero from "../components/HomeHero";
// import Navbar from "../components/Navbar";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{buildTitle()}</title>
      </Helmet>

      <div>Home</div>
    </>
  );
  // <Navbar />
  // <HomeHero />
}
