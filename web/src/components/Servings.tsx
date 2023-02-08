import Anchor from "./Anchor";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface ServingsProps {
  recipe?: RecipeData;
}

export default function Servings({ recipe }: ServingsProps) {
  if (!recipe) return null;

  return (
    <RecipeSectionHeading heading="Servings">
      <Anchor to={`/recipe/${recipe.id}/serving/new`}>Create</Anchor>
    </RecipeSectionHeading>
  );
}
