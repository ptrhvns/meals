import Anchor from "./Anchor";
import classes from "../styles/components/Times.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { isEmpty, sortBy } from "lodash";
import { RecipeData } from "../lib/types";

interface TimesProps {
  recipe?: RecipeData;
}

export default function Times({ recipe }: TimesProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Times">
        <Anchor to={`/recipe/${recipe.id}/time/new`}>Create</Anchor>
      </RecipeSectionHeading>

      {isEmpty(recipe.times) && (
        <Paragraph variant="dimmed">No times yet.</Paragraph>
      )}

      {!isEmpty(recipe.times) && (
        <ul className={classes.list}>
          {sortBy(recipe.times, "time_category").map((time) => (
            <li className={classes.listItem} key={time.id}>
              <Anchor
                className={classes.units}
                to={`/recipe/${recipe.id}/time/${time.id}/edit`}
              >
                <span>{time.time_category.name}:</span>
                {time.days && <span>{time.days}d</span>}
                {time.hours && <span>{time.hours}h</span>}
                {time.minutes && <span>{time.minutes}m</span>}
                {time.note && <span>({time.note})</span>}
              </Anchor>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
