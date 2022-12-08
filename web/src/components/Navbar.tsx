import Alert from "./Alert";
import Anchor from "./Anchor";
import classes from "../styles/components/Navbar.module.scss";
import Content from "./Content";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import Viewport from "./Viewport";
import { Dialog, DialogContent } from "./Dialog";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { authenticated, logout: logoutAuthn } = useAuthn();
  const { logout: logoutApi } = useApi();

  const logoClassName = joinClassNames(classes.logo, classes.link);

  const onDialogDismiss = () => setError(undefined);

  const onLogoutClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();
    const response = await logoutApi();

    if (response.isError) {
      setError(response?.message ?? "An unexpected error occurred.");
      return;
    }

    logoutAuthn(() => navigate("/"));
  };
  return (
    <>
      <Dialog open={!!error}>
        <DialogContent onDismiss={onDialogDismiss}>
          <Alert variant="error">{error}</Alert>
        </DialogContent>
      </Dialog>

      <Viewport className={classes.viewport}>
        <Content className={classes.content}>
          <Anchor className={logoClassName} to="/">
            <FontAwesomeIcon icon={faUtensils} /> Meals
          </Anchor>

          {authenticated ? (
            <Anchor onClick={onLogoutClick} to="/">
              Log out
            </Anchor>
          ) : (
            <Anchor to="/login">Log in</Anchor>
          )}
        </Content>
      </Viewport>
    </>
  );
}
