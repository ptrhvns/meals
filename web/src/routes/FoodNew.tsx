import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FoodNewForm from "../components/FoodNewForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function FoodNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Food")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard/food">Dashboard</Anchor>
            Create Food
          </Breadcrumbs>

          <Heading>Create Food</Heading>

          <FoodNewForm />
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
