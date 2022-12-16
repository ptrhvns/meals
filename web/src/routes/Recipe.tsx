import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/Recipe.module.scss";
import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import Paragraph from "../components/Paragraph";
import RequireAuthn from "../components/RequireAuthn";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Recipe() {
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeData>();
  const { recipeGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const response = await recipeGet(recipeId);
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setFormError });
      return;
    }

    setRecipe(response.data);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle(recipe ? recipe.title : "Recipe")}</title>
      </Helmet>

      <Navbar />

      <PageLayout>
        <Breadcrumbs>
          <Anchor to="/dashboard">Dashboard</Anchor>
          <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
        </Breadcrumbs>

        {loading && <Paragraph>Loading ...</Paragraph>}

        {!loading && formError && (
          <Alert
            alertClassName={classes.alert}
            onDismiss={() => setFormError(undefined)}
            variant="error"
          >
            {formError}
          </Alert>
        )}

        {!loading && !formError && <div>TODO - display recipe data</div>}
      </PageLayout>
    </RequireAuthn>
  );
}
