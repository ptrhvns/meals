import Alert from "../components/Alert";
import Anchor from "../components/Anchor";
import Breadcrumbs from "../components/Breadcrumbs";
import classes from "../styles/routes/RecipeCookingView.module.scss";
import Footer from "../components/Footer";
import FullPageViewport from "../components/FullPageViewport";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import PageSection from "../components/PageSection";
import Paragraph from "../components/Paragraph";
import RequireAuthn from "../components/RequireAuthn";
import StrikethroughCheckbox from "../components/StrikethroughCheckbox";
import useApi from "../hooks/useApi";
import { buildTitle, handleApiError } from "../lib/utils";
import { compact, isEmpty, join, sortBy } from "lodash";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { RecipeData } from "../lib/types";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function RecipeCookingView() {
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

    setRecipe(response.data.recipe);
  });

  return (
    <RequireAuthn>
      <Helmet>
        <title>{buildTitle("Cooking View")}</title>
      </Helmet>

      <Navbar />

      <FullPageViewport>
        <PageSection className={classes.pageSection}>
          <Breadcrumbs>
            <Anchor to="/dashboard">Dashboard</Anchor>
            <Anchor to={`/recipe/${recipeId}`}>Recipe</Anchor>
            Cooking View
          </Breadcrumbs>
        </PageSection>

        <PageSection className={classes.pageSection}>
          {loading ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : recipe ? (
            <>
              <Heading className={classes.heading}>{recipe.title}</Heading>

              {recipe.notes && (
                <div className={classes.section}>
                  <Heading className={classes.sectionHeading} size={2}>
                    Notes
                  </Heading>
                  <Paragraph>{recipe.notes}</Paragraph>
                </div>
              )}

              {isEmpty(recipe.equipment) || (
                <div className={classes.section}>
                  <Heading className={classes.sectionHeading} size={2}>
                    Equipment
                  </Heading>

                  {sortBy(recipe.equipment, "description").map((eq) => (
                    <div className={classes.listItem} key={eq.id}>
                      <StrikethroughCheckbox
                        itemId={eq.id}
                        label={eq.description}
                      />
                    </div>
                  ))}
                </div>
              )}

              {isEmpty(recipe.ingredients) || (
                <div className={classes.section}>
                  <Heading className={classes.sectionHeading} size={2}>
                    Ingredients
                  </Heading>

                  {sortBy(recipe.ingredients, "order").map((ingredient) => (
                    <div className={classes.listItem} key={ingredient.id}>
                      <StrikethroughCheckbox
                        itemId={ingredient.id}
                        label={join(
                          compact([
                            ingredient.amount &&
                              (ingredient.amount % 1 !== 0
                                ? ingredient.amount
                                : Math.ceil(ingredient.amount)),
                            ingredient.unit?.name,
                            ingredient.brand?.name,
                            ingredient.food.name,
                            ingredient.note,
                          ]),
                          " "
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              {isEmpty(recipe.directions) || (
                <div className={classes.section}>
                  <Heading className={classes.sectionHeading} size={2}>
                    Directions
                  </Heading>

                  {sortBy(recipe.directions, "order").map((direction) => (
                    <div className={classes.listItem} key={direction.id}>
                      <StrikethroughCheckbox
                        itemId={direction.id}
                        label={direction.description}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </PageSection>

        <PageSection className={classes.pageSection}>
          <Anchor to={`/recipe/${recipeId}`} variant="filled">
            Edit view
          </Anchor>
        </PageSection>
      </FullPageViewport>

      <Footer />
    </RequireAuthn>
  );
}
