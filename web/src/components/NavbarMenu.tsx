import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "./Button";
import classes from "../styles/components/NavbarMenu.module.scss";
import useApi from "../hooks/useApi";
import useAuthn from "../hooks/useAuthn";
import { Dispatch, SetStateAction } from "react";
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={classes.button} variant="unstyled">
          <AccessibleIcon.Root label="Menu">
            <FontAwesomeIcon icon={faBars} />
          </AccessibleIcon.Root>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={classes.content}>
          <DropdownMenu.Item
            className={classes.item}
            onClick={() => navigate("/")}
          >
            Dashboard
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={classes.item}
            onClick={() => navigate("/settings")}
          >
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={classes.separator} />

          <DropdownMenu.Item
            className={classes.item}
            onClick={async () => {
              const response = await logoutApi();

              if (response.isError) {
                setError(response?.message ?? "An unexpected error occurred.");
                return;
              }

              logoutAuthn(() => navigate("/"));
            }}
          >
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
