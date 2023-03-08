import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Tags.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import TagForRecipeUnlinkForm from "./TagForRecipeUnlinkForm";
import { Dispatch } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
        <AnchorIcon
          color="slate"
          icon={faPlus}
          label="Create"
          to={`/recipe/${recipe.id}/tag/new`}
        />
      </RecipeSectionHeading>

      {isEmpty(recipe.tags) && (
        <Paragraph variant="dimmed">No tags yet.</Paragraph>
      )}

      {recipe.tags && (
        <div className={classes.tags}>
          {recipe.tags.map((tag) => (
            <span className={classes.tag} key={tag.id}>
              {tag.name}
              <span className={classes.tagFormWrapper}>
                <TagForRecipeUnlinkForm
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
