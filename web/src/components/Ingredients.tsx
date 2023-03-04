import Anchor from "./Anchor";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { isEmpty } from "lodash";
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
        <Paragraph>TODO display ingredients</Paragraph>
      )}
    </>
  );
}
