import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import RecipeTitleEditForm from "../components/RecipeTitleEditForm";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function RecipeTitleEdit() {
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
        <title>{buildTitle("Edit Recipe Title")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection variant="narrow">
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Edit Recipe Title
          </Breadcrumbs>

          <Heading>Edit Recipe Title</Heading>

          {!loading && error && (
            <Alert onDismiss={() => setError(undefined)} variant="error">
              {error}
            </Alert>
          )}

          {!loading && !error && <RecipeTitleEditForm recipe={recipe} />}
        </PageSection>
      </FullPageViewport>
    </RequireAuthn>
  );
}
