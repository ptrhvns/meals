import Anchor from "./Anchor";
import classes from "../styles/components/HomeHero.module.scss";
import Heading from "./Heading";
import Hero from "./Hero";
import Paragraph from "./Paragraph";

export default function HomeHero() {
  return (
    <Hero viewportClassName={classes.viewport}>
      <Heading className={classes.heading}>Meals made easy.</Heading>

      <Paragraph className={classes.subheading}>
        Save time. Get rid of boring work. We can help you manage your
        recipes, menus, shopping lists, etc.
      </Paragraph>

      <Anchor
        className={classes.button}
        color="primary"
        to="/signup"
        variant="filled"
      >
        Sign up
      </Anchor>
    </Hero>
  );
}
