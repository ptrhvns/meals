import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipeNewForm from "../components/RecipeNewForm";
import RequireAuthn from "../components/RequireAuthn";
import Subheading from "../components/Subheading";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";

export default function RecipeNew() {
  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Recipe")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            Create Recipe
          </Breadcrumbs>

          <Heading>Create Recipe</Heading>
          <Subheading>Start with a recipe title.</Subheading>

          <RecipeNewForm />
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
