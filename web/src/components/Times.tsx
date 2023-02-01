import Anchor from "./Anchor";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface TimesProps {
  recipe?: RecipeData;
}

export default function Times({ recipe }: TimesProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Times">
        <Anchor to={`/recipe/${recipe.id}/time/new`}>Create</Anchor>
      </RecipeSectionHeading>
    </>
  );
}
