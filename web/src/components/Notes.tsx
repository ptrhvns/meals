import AnchorIcon from "./AnchorIcon";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { RecipeData } from "../lib/types";

interface NotesProps {
  recipe?: RecipeData;
}

export default function Notes({ recipe }: NotesProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Notes">
        <AnchorIcon
          color="slate"
          icon={faPenToSquare}
          label="Edit"
          to={`/recipe/${recipe.id}/notes/edit`}
        />
      </RecipeSectionHeading>

      {!recipe?.notes && <Paragraph variant="dimmed">No notes yet.</Paragraph>}

      {recipe?.notes && <Paragraph>{recipe.notes}</Paragraph>}
    </>
  );
}
