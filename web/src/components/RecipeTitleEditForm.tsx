import { RecipeData } from "../lib/types";

interface RecipeTitleEditFormProps {
  recipe?: RecipeData;
}

export default function RecipeTitleEditForm({
  recipe,
}: RecipeTitleEditFormProps) {
  if (!recipe) return null;

  return <div>RecipeTitleEditForm</div>; // TODO implement component
}
