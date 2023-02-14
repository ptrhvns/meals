import Anchor from "./Anchor";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";

interface NotesProps {
  recipe?: RecipeData;
}

export default function Notes({ recipe }: NotesProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Notes">
        <Anchor to={`/recipe/${recipe.id}/notes/edit`}>Edit</Anchor>
      </RecipeSectionHeading>

      {!recipe?.notes && <Paragraph variant="dimmed">No notes yet.</Paragraph>}

      {recipe?.notes && <Paragraph>{recipe.notes}</Paragraph>}
    </>
  );
}
