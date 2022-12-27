import Anchor from "./Anchor";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface TagsProps {
  recipe?: RecipeData;
}

export default function Tags({ recipe }: TagsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Tags">
        <Anchor to={`/recipe/${recipe.id}/tag/new`}>Create</Anchor>
      </RecipeSectionHeading>
    </>
  );
}
