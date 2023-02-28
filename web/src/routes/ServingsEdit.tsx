import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RequireAuthn from "../components/RequireAuthn";
import ServingsEditForm from "../components/ServingsEditForm";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ServingsEdit() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeData>();
  const { recipeGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const response = await recipeGet({ recipeId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    setRecipe(response.data);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Edit Servings")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit Servings
          </Breadcrumbs>

          <Heading>Edit Servings</Heading>

          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <ServingsEditForm recipe={recipe} />
          )}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
