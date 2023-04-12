import Footer from "../components/Footer";
import HomeHero from "../components/HomeHero";
import Navbar from "../components/Navbar";
import RequireGuest from "../components/RequireGuest";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <RequireGuest>
      <Helmet>
        <title>{buildTitle()}</title>
      </Helmet>

      <Navbar />
      <HomeHero />
      <Footer />
    </RequireGuest>
  );
}
