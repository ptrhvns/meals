import Anchor from "./Anchor";
import classes from "../styles/components/Tags.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { isEmpty } from "lodash";
import { RecipeData } from "../lib/types";

interface TagsProps {
  recipe?: RecipeData;
}

export default function Tags({ recipe }: TagsProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Tags">
        <Anchor to={`/recipe/${recipe.id}/tag/new`}>Create</Anchor>
      </RecipeSectionHeading>

      {isEmpty(recipe.tags) && (
        <Paragraph className={classes.noTagsMessage}>
          No tags have been created yet.
        </Paragraph>
      )}

      {recipe.tags && (
        <div className={classes.tags}>
          {recipe.tags.map((tag) => (
            <span className={classes.tag} key={tag.id}>
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
