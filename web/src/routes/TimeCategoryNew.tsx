import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import TimeCategoryNewForm from "../components/TimeCategoryNewForm";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function TimeCategoryNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Time Category")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/times">Dashboard</Anchor>
            Create Time Category
          </Breadcrumbs>

          <Heading>Create Time Category</Heading>

          <TimeCategoryNewForm />
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
