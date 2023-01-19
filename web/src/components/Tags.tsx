import Anchor from "./Anchor";
import classes from "../styles/components/Tags.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import TagForRecipeDeleteForm from "./TagForRecipeDeleteForm";
import { Dispatch } from "react";
import { isEmpty } from "lodash";
import { RecipeData, RecipeReducerAction } from "../lib/types";

interface TagsProps {
  dispatch: Dispatch<RecipeReducerAction>;
  recipe?: RecipeData;
}

export default function Tags({ dispatch, recipe }: TagsProps) {
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
              <span className={classes.tagFormWrapper}>
                <TagForRecipeDeleteForm
                  dispatch={dispatch}
                  recipe={recipe}
                  tag={tag}
                />
              </span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
