import Anchor from "../components/Anchor";
import BrandNewForm from "../components/BrandNewForm";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function BrandNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Brand")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/brands">Dashboard</Anchor>
            Create Brand
          </Breadcrumbs>

          <Heading>Create Brand</Heading>

          <BrandNewForm />
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
