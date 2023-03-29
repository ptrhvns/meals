import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Directions.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { isEmpty, sortBy } from "lodash";
import { RecipeData } from "../lib/types";

interface DirectionsProps {
  recipe?: RecipeData;
}

export default function Directions({ recipe }: DirectionsProps) {
  if (!recipe) return null;

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

      {isEmpty(recipe.directions) && (
        <Paragraph variant="dimmed">No directions yet.</Paragraph>
      )}

      {!isEmpty(recipe.directions) && (
        <ul className={classes.list}>
          {sortedDirections.map((direction) => (
            <li className={classes.listItem} key={direction.id}>
              {direction.description}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
