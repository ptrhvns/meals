import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/Recipe.module.scss";
import Equipment from "../components/Equipment";
import FullPageViewport from "../components/FullPageViewport";
import Navbar from "../components/Navbar";
import Notes from "../components/Notes";
import PageSection from "../components/PageSection";
import Rating from "../components/Rating";
import RecipeDeleteForm from "../components/RecipeDeleteForm";
import RecipeTitle from "../components/RecipeTitle";
import RequireAuthn from "../components/RequireAuthn";
import Servings from "../components/Servings";
import Tags from "../components/Tags";
import Times from "../components/Times";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError, joinClassNames } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { RecipeData, RecipeReducerAction } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useReducer, useState } from "react";

interface ReducerState {
  recipe?: RecipeData;
}

export default function Recipe() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { recipeGet } = useApi();
  const { recipeId } = useParams() as { recipeId: string };

  const [{ recipe }, dispatch] = useReducer(
    (state: ReducerState, action: RecipeReducerAction): ReducerState => {
      switch (action.type) {
        case "setRecipe":
          return { ...state, recipe: action.payload };
        case "unlinkTag":
          if (state.recipe) {
            return {
              ...state,
              recipe: {
                ...state.recipe,
                tags: state.recipe.tags?.filter(
                  (tag) => tag.id !== action.payload
                ),
              },
            };
          }

          return state;
        default:
          return state;
      }
    },
    {}
  );

  useEffectOnce(async () => {
    const response = await recipeGet({ recipeId });
    setLoading(false);

    if (response.isError) {
      handleApiError(response, { setError });
      return;
    }

    dispatch({ type: "setRecipe", payload: response.data });
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle(recipe ? recipe.title : "Recipe")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport className={classes.viewport}>
        <PageSection className={classes.pageSection}>
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            Recipe
          </Breadcrumbs>
        </PageSection>

        {!loading && error && (
          <PageSection className={classes.pageSection}>
            <Alert variant="error">{error}</Alert>
          </PageSection>
        )}

        {!loading && !error && (
          <>
            <PageSection className={classes.pageSection}>
              <RecipeTitle recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Tags dispatch={dispatch} recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Rating recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Times recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Servings recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Notes recipe={recipe} />
            </PageSection>

            <PageSection className={classes.pageSection}>
              <Equipment recipe={recipe} />
            </PageSection>

            <PageSection className={joinClassNames(classes.pageSection)}>
              <RecipeDeleteForm recipe={recipe} />
            </PageSection>
          </>
        )}
      </FullPageViewport>
    </RequireAuthn>
  );
}
