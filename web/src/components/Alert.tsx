import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Button from "./Button";
import classes from "../styles/components/Alert.module.scss";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { MouseEventHandler, ReactNode } from "react";

interface AlertProps {
  alertClassName?: string;
  children: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  variant: "error" | "info" | "success" | "warning";
}

export default function Alert({
  alertClassName,
  children,
  onDismiss,
  variant,
}: AlertProps) {
  alertClassName = joinClassNames(
    classes.alert,
    classes[variant],
    alertClassName
  );
  const buttonClassName = joinClassNames(classes.button, classes[variant]);

  return (
    <div className={alertClassName} role="alert">
      <div>{children}</div>

      {onDismiss && (
        <div>
          <Button
            aria-label="Dismiss"
            className={buttonClassName}
            onClick={onDismiss}
            title="Dismiss"
            type="button"
            variant="unstyled"
          >
            <AccessibleIcon.Root label="Dismiss">
              <FontAwesomeIcon icon={faTimes} />
            </AccessibleIcon.Root>
          </Button>
        </div>
      )}
    </div>
  );
}
