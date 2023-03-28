import AnchorIcon from "./AnchorIcon";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RecipeData } from "../lib/types";

interface DirectionsProps {
  recipe?: RecipeData;
}

export default function Directions({ recipe }: DirectionsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Directions">
        <AnchorIcon
          color="slate"
          icon={faPlus}
          label="Create"
          to={`/recipe/${recipe.id}/direction/new`}
        />
      </RecipeSectionHeading>
    </>
  );
}
