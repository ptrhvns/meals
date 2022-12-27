import Anchor from "./Anchor";
import classes from "../styles/components/RecipeTitle.module.scss";
import Heading from "./Heading";
import { RecipeData } from "../lib/types";

interface RecipeTitleProps {
  recipe?: RecipeData;
}

export default function RecipeTitle({ recipe }: RecipeTitleProps) {
  if (!recipe) return null;

  return (
    <div className={classes.wrapper}>
      <Heading className={classes.heading}>{recipe.title}</Heading>
      <Anchor to={`/recipe/${recipe.id}/title/edit`}>Edit</Anchor>
    </div>
  );
}
