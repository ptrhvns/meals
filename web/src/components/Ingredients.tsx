import Anchor from "./Anchor";
import classes from "../styles/components/Ingredients.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { compact, isEmpty, join, sortBy } from "lodash";
import { RecipeData } from "../lib/types";

interface IngredientsProps {
  recipe?: RecipeData;
}

export default function Ingredients({ recipe }: IngredientsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Ingredients">
        <Anchor to={`/recipe/${recipe.id}/ingredient/new`}>Create</Anchor>
      </RecipeSectionHeading>

      {isEmpty(recipe.ingredients) && (
        <Paragraph variant="dimmed">No ingredients yet.</Paragraph>
      )}

      {!isEmpty(recipe.ingredients) && (
        <ul className={classes.list}>
          {sortBy(recipe.ingredients, "order").map((ingredient) => (
            <li className={classes.listItem} key={ingredient.id}>
              {join(
                compact([
                  ingredient.amount,
                  ingredient.unit?.name,
                  ingredient.brand?.name,
                  ingredient.food.name,
                ]),
                " "
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
