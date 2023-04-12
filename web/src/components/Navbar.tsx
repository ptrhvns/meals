import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/Navbar.module.scss";
import Content from "./Content";
import NavbarMenu from "./NavbarMenu";
import useAuthn from "../hooks/useAuthn";
import Viewport from "./Viewport";
import { Dialog, DialogContent } from "./Dialog";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { useState } from "react";

export default function Navbar() {
  const [error, setError] = useState<string>();
  const { authenticated } = useAuthn();

  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={() => setError(undefined)}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <nav aria-label="Navbar">
        <Viewport className={classes.viewport}>
          <Content className={classes.content}>
            <Anchor
              className={joinClassNames(classes.logo, classes.link)}
              to="/"
            >
              <FontAwesomeIcon icon={faUtensils} /> Meal Gizmo
            </Anchor>

            <div>
              {authenticated ? (
                <NavbarMenu setError={setError} />
              ) : (
                <Anchor to="/login">Log in</Anchor>
              )}
            </div>
          </Content>
        </Viewport>
      </nav>
    </>
  );
}
