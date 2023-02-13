import Anchor from "./Anchor";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { RecipeData } from "../lib/types";
import Paragraph from "./Paragraph";

interface NotesProps {
  recipe?: RecipeData;
}

export default function Notes({ recipe }: NotesProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Notes">
        <Anchor to={`/recipe/${recipe.id}/notes/new`}>Create</Anchor>
      </RecipeSectionHeading>

      {!recipe?.notes && <Paragraph variant="dimmed">No notes yet.</Paragraph>}

      {recipe?.notes && <Paragraph>TODO: display notes here.</Paragraph>}
    </>
  );
}
