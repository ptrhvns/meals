import AnchorIcon from "./AnchorIcon";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { RecipeData } from "../lib/types";

interface ServingsProps {
  recipe?: RecipeData;
}

export default function Servings({ recipe }: ServingsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Servings">
        <AnchorIcon
          color="slate"
          icon={faPenToSquare}
          label="Edit"
          to={`/recipe/${recipe.id}/servings/edit`}
        />
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
