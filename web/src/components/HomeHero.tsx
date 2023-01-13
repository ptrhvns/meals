import Anchor from "./Anchor";
import Balancer from "react-wrap-balancer";
import classes from "../styles/components/HomeHero.module.scss";
import Heading from "./Heading";
import Hero from "./Hero";
import Paragraph from "./Paragraph";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HomeHero() {
  return (
    <Hero viewportClassName={classes.viewport}>
      <Heading className={classes.heading}>Meals made easy.</Heading>

      <Paragraph className={classes.subheading}>
        <Balancer>
          Save time, and get rid of boring work. We can help you manage your
          recipes, menus, shopping lists, and much more.
        </Balancer>
      </Paragraph>

      <Anchor
        className={classes.button}
        color="primary"
        to="/signup"
        variant="filled"
      >
        <FontAwesomeIcon icon={faUserPlus} /> Sign up
      </Anchor>
    </Hero>
  );
}
