import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/SortableIngredient.module.scss";
import { compact, join } from "lodash";
import { CSS } from "@dnd-kit/utilities";
import { faGripLines, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IngredientData, RecipeData } from "../lib/types";
import { useSortable } from "@dnd-kit/sortable";

interface SortableIngredientProps {
  ingredient: IngredientData;
  listItemClassname?: string;
  listItemContentClassname?: string;
  recipe: RecipeData;
}

export default function SortableIngredient({
  ingredient,
  listItemClassname,
  listItemContentClassname,
  recipe,
}: SortableIngredientProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={listItemClassname}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <span className={classes.actions}>
        <AccessibleIcon.Root label="Drag to sort">
          <FontAwesomeIcon
            className={classes.gripIcon}
            icon={faGripLines}
            title="Drag to sort"
            {...listeners}
          />
        </AccessibleIcon.Root>

        <AnchorIcon
          color="slate"
          icon={faPenToSquare}
          label="Edit"
          to={`/recipe/${recipe.id}/ingredient/${ingredient.id}/edit`}
        />
      </span>
      <span className={listItemContentClassname}>
        {join(
          compact([
            ingredient.amount,
            ingredient.unit?.name,
            ingredient.brand?.name,
            ingredient.food.name,
          ]),
          " "
        )}
      </span>
    </li>
  );
}
