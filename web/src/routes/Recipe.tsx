import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/Recipe.module.scss";
import Navbar from "../components/Navbar";
import RecipeSection from "../components/RecipeSection";
import RecipeTitle from "../components/RecipeTitle";
import RequireAuthn from "../components/RequireAuthn";
import Skeleton from "../components/Skeleton";
import useApi from "../hooks/useApi";
import Viewport from "../components/Viewport";
import { buildTitle, handleApiError } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Recipe() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeData>();
  const { recipeGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  useEffectOnce(async () => {
    const response = await recipeGet(recipeId);
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
        <title>{buildTitle(recipe ? recipe.title : "Recipe")}</title>
      </Helmet>

      <Navbar />

      <Viewport className={classes.viewport}>
        <RecipeSection containerClassName={classes.recipeSection}>
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
          </Breadcrumbs>
        </RecipeSection>

        {loading && (
          <RecipeSection containerClassName={classes.recipeSection}>
            <div className={classes.skeletonGroup}>
              <Skeleton width="60%" />
              <Skeleton />
              <Skeleton />
            </div>

            <div className={classes.skeletonGroup}>
              <Skeleton width="60%" />
              <Skeleton />
              <Skeleton />
            </div>
          </RecipeSection>
        )}

        {!loading && error && (
          <RecipeSection containerClassName={classes.recipeSection}>
            <Alert onDismiss={() => setError(undefined)} variant="error">
              {error}
            </Alert>
          </RecipeSection>
        )}

        {!loading && !error && (
          <RecipeSection containerClassName={classes.recipeSection}>
            <RecipeTitle recipe={recipe} />
          </RecipeSection>
        )}
      </Viewport>
    </RequireAuthn>
  );
}
