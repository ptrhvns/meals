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
        <Paragraph className={classes.empty}>No times yet.</Paragraph>
      )}

      {!isEmpty(recipe.times) && (
        <ul className={classes.list}>
          {sortBy(recipe.times, "time_category").map((t) => (
            <li className={classes.listItem} key={t.id}>
              <span className={classes.unitsWrapper}>
                <span>{t.time_category.name}:</span>
                {t.days && <span>{t.days}d</span>}
                {t.hours && <span>{t.hours}h</span>}
                {t.minutes && <span>{t.minutes}m</span>}
                {t.note && <span>({t.note})</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
