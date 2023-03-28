import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import DirectionNewForm from "../components/DirectionNewForm";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import { buildTitle } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

export default function DirectionNew() {
  const { recipeId } = useParams() as { recipeId: string };

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Create Direction")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Create Direction
          </Breadcrumbs>

          <Heading>Create Direction</Heading>

          <DirectionNewForm recipeId={recipeId} />
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
