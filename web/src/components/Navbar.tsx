import Anchor from "./Anchor";
import Content from "./Content";
import Viewport from "./Viewport";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Navbar.module.scss";

export default function Navbar() {
  const logoClassName = joinClassNames(classes.logo, classes.link);

  return (
    <Viewport className={classes.viewport}>
      <Content>
        <Anchor className={logoClassName} to="/">
          <FontAwesomeIcon icon={faUtensils} /> Meals
        </Anchor>
      </Content>
    </Viewport>
  );
}
