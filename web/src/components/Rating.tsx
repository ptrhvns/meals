import AnchorIcon from "./AnchorIcon";
import classes from "../styles/components/Rating.module.scss";
import Paragraph from "./Paragraph";
import RecipeSectionHeading from "./RecipeSectionHeading";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
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
        <AnchorIcon
          color="slate"
          icon={faPenToSquare}
          label="Edit"
          to={`/recipe/${recipe.id}/rating/edit`}
        />
      </RecipeSectionHeading>

      {!isNumber(recipe.rating) && (
        <Paragraph variant="dimmed">No rating yet.</Paragraph>
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
