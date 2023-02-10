import Anchor from "./Anchor";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface ServingsProps {
  recipe?: RecipeData;
}

export default function Servings({ recipe }: ServingsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Servings">
        <Anchor to={`/recipe/${recipe.id}/servings/edit`}>Edit</Anchor>
      </RecipeSectionHeading>

      {!recipe?.servings && (
        <Paragraph variant="dimmed">No servings yet.</Paragraph>
      )}

      {recipe?.servings && (
        <Paragraph>
          Total: {parseFloat((recipe?.servings || 0).toString())}
        </Paragraph>
      )}
    </>
  );
}
