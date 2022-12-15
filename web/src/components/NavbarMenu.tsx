import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "./Button";
import classes from "../styles/components/NavbarMenu.module.scss";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

interface NavbarMenuProps {
  setError: Dispatch<SetStateAction<string | undefined>>;
}

export default function NavbarMenu({ setError }: NavbarMenuProps) {
  const navigate = useNavigate();
  const { logout: logoutApi } = useApi();
  const { logout: logoutAuthn } = useAuthn();

  const onDashboardClick = () => navigate("/");
  const onSettingsClick = () => navigate("/settings");

  const onLogoutClick: MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    const response = await logoutApi();

    if (response.isError) {
      setError(response?.message ?? "An unexpected error occurred.");
      return;
    }

    logoutAuthn(() => navigate("/"));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={classes.button} variant="unstyled">
          <FontAwesomeIcon icon={faBars} /> Menu
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={classes.content}>
          <DropdownMenu.Item
            className={classes.item}
            onClick={onDashboardClick}
          >
            Dashboard
          </DropdownMenu.Item>

          <DropdownMenu.Item className={classes.item} onClick={onSettingsClick}>
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={classes.separator} />

          <DropdownMenu.Item className={classes.item} onClick={onLogoutClick}>
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
