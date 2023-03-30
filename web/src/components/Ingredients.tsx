import Alert from "./Alert";
import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Ingredients.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import SortableIngredient from "./SortableIngredient";
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

interface IngredientsProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe?: RecipeData;
}

export default function Ingredients({ dispatch, recipe }: IngredientsProps) {
  const [error, setError] = useState<string>();
  const { ingredientsReorder } = useApi();

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
      const oldIngredients = cloneDeep(recipe.ingredients);

      const newIngredients = cloneDeep(recipe.ingredients);
      const oldIndex = oldIngredients.findIndex((i) => i.id === active.id);
      const newIndex = oldIngredients.findIndex((i) => i.id === over.id);

      newIngredients.splice(
        newIndex < 0 ? newIngredients.length + newIndex : newIndex,
        0,
        newIngredients.splice(oldIndex, 1)[0]
      );

      newIngredients.forEach((ingredient, index) => {
        ingredient.order = index;
      });

      dispatch({ type: "setIngredients", payload: newIngredients });

      const data = {
        ingredients: newIngredients.map((i) => pick(i, ["id", "order"])),
      };

      const response = await ingredientsReorder({ data });

      if (!response.isError) return;

      dispatch({ type: "setIngredients", payload: oldIngredients });
      setError(response.message ?? "Your ingredients couldn't be sorted.");
    }
  }

  const sortedIngredients = sortBy(recipe.ingredients, "order");

  return (
    <>
      <RecipeSectionHeading heading="Ingredients">
        <AnchorIcon
          color="slate"
          icon={faPlus}
          label="Create"
          to={`/recipe/${recipe.id}/ingredient/new`}
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

      {isEmpty(recipe.ingredients) && (
        <Paragraph variant="dimmed">No ingredients yet.</Paragraph>
      )}

      {!isEmpty(recipe.ingredients) && (
        <ul className={classes.list}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedIngredients.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedIngredients.map((ingredient) => (
                <SortableIngredient
                  ingredient={ingredient}
                  key={ingredient.id}
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
