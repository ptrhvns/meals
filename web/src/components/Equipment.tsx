import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Equipment.module.scss";
import EquipmentForRecipeUnlinkForm from "./EquipmentForRecipeUnlinkForm";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { Dispatch } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
        <AnchorIcon
          color="slate"
          icon={faPlus}
          label="Create"
          to={`/recipe/${recipe.id}/equipment/new`}
        />
      </RecipeSectionHeading>

      {isEmpty(recipe.equipment) && (
        <Paragraph variant="dimmed">No equipment yet.</Paragraph>
      )}

      {!isEmpty(recipe.equipment) && (
        <ul className={classes.list}>
          {sortBy(recipe.equipment, "description").map((eq) => (
            <li className={classes.listItem} key={eq.id}>
              <EquipmentForRecipeUnlinkForm
                dispatch={dispatch}
                equipment={eq}
                recipe={recipe}
              />
              <span className={classes.listItemContent}>{eq.description}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
