import Anchor from "./Anchor";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface EquipmentProps {
  recipe?: RecipeData;
}

export default function Equipment({ recipe }: EquipmentProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Equipment">
        <Anchor to={`/recipe/${recipe.id}/equipment/new`}>Create</Anchor>
      </RecipeSectionHeading>
    </>
  );
}
