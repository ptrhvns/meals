import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Ingredients.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { compact, isEmpty, join, sortBy } from "lodash";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { RecipeData } from "../lib/types";

interface IngredientsProps {
  recipe?: RecipeData;
}

export default function Ingredients({ recipe }: IngredientsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Ingredients">
        <AnchorIcon
          color="slate"
          icon={faPlus}
          label="Create"
          to={`/recipe/${recipe.id}/ingredient/new`}
        />
      </RecipeSectionHeading>

      {isEmpty(recipe.ingredients) && (
        <Paragraph variant="dimmed">No ingredients yet.</Paragraph>
      )}

      {!isEmpty(recipe.ingredients) && (
        <ul className={classes.list}>
          {sortBy(recipe.ingredients, "order").map((ingredient) => (
            <li className={classes.listItem} key={ingredient.id}>
              <AnchorIcon
                color="slate"
                icon={faPenToSquare}
                label="Edit"
                to={`/recipe/${recipe.id}/ingredient/${ingredient.id}/edit`}
              />
              <span className={classes.listItemContent}>
                {join(
                  compact([
                    ingredient.amount,
                    ingredient.unit?.name,
                    ingredient.brand?.name,
                    ingredient.food.name,
                  ]),
                  " "
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
