import Alert from "./Alert";
import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Directions.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import SortableDirection from "./SortableDirection";
import useApi from "../hooks/useApi";
import { cloneDeep, isEmpty, pick, sortBy } from "lodash";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Dispatch, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RecipeData, RecipeReducerAction } from "../lib/types";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface DirectionsProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe?: RecipeData;
}

export default function Directions({ dispatch, recipe }: DirectionsProps) {
  const [error, setError] = useState<string>();
  const { directionsReorder } = useApi();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!recipe) return null;

  async function handleDragEnd(event: DragEndEvent) {
    if (!recipe) return;

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldDirections = cloneDeep(recipe.directions);

      const newDirections = cloneDeep(recipe.directions);
      const oldIndex = newDirections.findIndex((d) => d.id === active.id);
      const newIndex = newDirections.findIndex((d) => d.id === over.id);

      newDirections.splice(
        newIndex < 0 ? newDirections.length + newIndex : newIndex,
        0,
        newDirections.splice(oldIndex, 1)[0]
      );

      newDirections.forEach((direction, index) => {
        direction.order = index;
      });

      dispatch({ type: "setDirections", payload: newDirections });

      const data = {
        directions: newDirections.map((d) => pick(d, ["id", "order"])),
      };

      const response = await directionsReorder({ data });

      if (!response.isError) return;

      dispatch({ type: "setDirections", payload: oldDirections });
      setError(response.message ?? "Your directions couldn't be sorted.");
    }
  }

  const sortedDirections = sortBy(recipe.directions, "order");

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

      {error && (
        <Alert
          alertClassName={classes.alert}
          onDismiss={() => setError(undefined)}
          variant="error"
        >
          {error}
        </Alert>
      )}

      {isEmpty(recipe.directions) && (
        <Paragraph variant="dimmed">No directions yet.</Paragraph>
      )}

      {!isEmpty(recipe.directions) && (
        <ul className={classes.list}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedDirections.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedDirections.map((direction) => (
                <SortableDirection
                  direction={direction}
                  key={direction.id}
                  listItemClassname={classes.listItem}
                  listItemContentClassname={classes.listItemContent}
                  recipe={recipe}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      )}
    </>
  );
}
