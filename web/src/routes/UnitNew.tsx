import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import UnitNewForm from "../components/UnitNewForm";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function UnitNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Unit")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/units">Dashboard</Anchor>
            Create Unit
          </Breadcrumbs>

          <Heading>Create Unit</Heading>

          <UnitNewForm />
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
