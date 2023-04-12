import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import EquipmentNewForm from "../components/EquipmentNewForm";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function EquipmentNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Equipment")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/equipment">Dashboard</Anchor>
            Create Equipment
          </Breadcrumbs>

          <Heading>Create Equipment</Heading>

          <EquipmentNewForm />
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
