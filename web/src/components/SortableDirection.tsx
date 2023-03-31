import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/SortableDirection.module.scss";
import { CSS } from "@dnd-kit/utilities";
import { DirectionData, RecipeData } from "../lib/types";
import { faGripLines, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { useSortable } from "@dnd-kit/sortable";

interface SortableDirectionProps {
  direction: DirectionData;
  listItemClassname?: string;
  listItemContentClassname?: string;
  recipe: RecipeData;
}

export default function SortableDirection({
  direction,
  listItemClassname,
  listItemContentClassname,
  recipe,
}: SortableDirectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: direction.id });

  // Prevent vertical "squishing" of draggable.
  if (transform?.scaleY) transform.scaleY = 1.0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  listItemClassname = joinClassNames(classes.listItem, listItemClassname);

  return (
    <li
      className={listItemClassname}
      ref={setNodeRef}
      style={style}
    >
      <span className={classes.actions}>
        <AccessibleIcon.Root label="Drag to sort">
          <FontAwesomeIcon
            className={classes.gripIcon}
            icon={faGripLines}
            title="Drag to sort"
            {...attributes}
            {...listeners}
          />
        </AccessibleIcon.Root>

        <AnchorIcon
          color="slate"
          icon={faPenToSquare}
          label="Edit"
          to={`/recipe/${recipe.id}/direction/${direction.id}/edit`}
        />
      </span>

      <span className={listItemContentClassname}>{direction.description}</span>
    </li>
  );
}
