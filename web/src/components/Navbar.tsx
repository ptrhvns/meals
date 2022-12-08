import Anchor from "./Anchor";
import classes from "../styles/components/Navbar.module.scss";
import Content from "./Content";
import Viewport from "./Viewport";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";

export default function Navbar() {
  const logoClassName = joinClassNames(classes.logo, classes.link);

  return (
    <Viewport className={classes.viewport}>
      <Content className={classes.content}>
        <Anchor className={logoClassName} to="/">
          <FontAwesomeIcon icon={faUtensils} /> Meals
        </Anchor>
        <Anchor to="/login">Log in</Anchor>
      </Content>
    </Viewport>
  );
}
