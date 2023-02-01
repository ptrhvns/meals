import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/Recipe.module.scss";
import Navbar from "../components/Navbar";
import Rating from "../components/Rating";
import RecipeDeleteForm from "../components/RecipeDeleteForm";
import RecipeSection from "../components/RecipeSection";
import RecipeTitle from "../components/RecipeTitle";
import RequireAuthn from "../components/RequireAuthn";
import Tags from "../components/Tags";
import useApi from "../hooks/useApi";
import Viewport from "../components/Viewport";
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

      <Viewport className={classes.viewport}>
        <RecipeSection containerClassName={classes.recipeSection}>
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            Recipe
          </Breadcrumbs>
        </RecipeSection>

        {!loading && error && (
          <RecipeSection containerClassName={classes.recipeSection}>
            <Alert onDismiss={() => setError(undefined)} variant="error">
              {error}
            </Alert>
          </RecipeSection>
        )}

        {!loading && !error && (
          <>
            <RecipeSection containerClassName={classes.recipeSection}>
              <RecipeTitle recipe={recipe} />
            </RecipeSection>

            <RecipeSection containerClassName={classes.recipeSection}>
              <Tags dispatch={dispatch} recipe={recipe} />
            </RecipeSection>

            <RecipeSection containerClassName={classes.recipeSection}>
              <Rating recipe={recipe} />
            </RecipeSection>

            <RecipeSection
              containerClassName={joinClassNames(
                classes.recipeSection,
                classes.noSectionHeader
              )}
            >
              <RecipeDeleteForm recipe={recipe} />
            </RecipeSection>
          </>
        )}
      </Viewport>
    </RequireAuthn>
  );
}
