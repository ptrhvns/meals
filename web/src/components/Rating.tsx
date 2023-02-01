import Anchor from "./Anchor";
import classes from "../styles/components/Rating.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { isNumber } from "lodash";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { RecipeData } from "../lib/types";

interface RatingProps {
  recipe?: RecipeData;
}

export default function Rating({ recipe }: RatingProps) {
  if (!recipe) return null;

  return (
    <>
      <RecipeSectionHeading heading="Rating">
        <Anchor to={`/recipe/${recipe.id}/rating/edit`}>Edit</Anchor>
      </RecipeSectionHeading>

      {!isNumber(recipe.rating) && (
        <Paragraph className={classes.empty}>No rating yet.</Paragraph>
      )}

      {isNumber(recipe.rating) && (
        <div className={classes.ratingWrapper}>
          <ReactRating
            className={classes.rating}
            readOnly
            value={recipe.rating || 0}
          />
          <span className={classes.ratingText}>({recipe.rating || 0})</span>
        </div>
      )}
    </>
  );
}
