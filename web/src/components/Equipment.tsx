import Anchor from "./Anchor";
import classes from "../styles/components/Equipment.module.scss";
import EquipmentForRecipeUnlinkForm from "./EquipmentForRecipeUnlinkForm";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { Dispatch } from "react";
import { isEmpty, sortBy } from "lodash";
import { RecipeData, RecipeReducerAction } from "../lib/types";

interface EquipmentProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe?: RecipeData;
}

export default function Equipment({ dispatch, recipe }: EquipmentProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Equipment">
        <Anchor to={`/recipe/${recipe.id}/equipment/new`}>Create</Anchor>
      </RecipeSectionHeading>

      {isEmpty(recipe.equipment) && (
        <Paragraph variant="dimmed">No equipment yet.</Paragraph>
      )}

      {recipe.equipment && (
        <ul className={classes.list}>
          {sortBy(recipe.equipment, "description").map((eq) => (
            <li className={classes.listItem} key={eq.id}>
              <EquipmentForRecipeUnlinkForm
                dispatch={dispatch}
                equipment={eq}
                recipe={recipe}
              />{" "}
              {eq.description}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
