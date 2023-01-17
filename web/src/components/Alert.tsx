import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Button from "./Button";
import classes from "../styles/components/Alert.module.scss";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { MouseEventHandler, ReactNode } from "react";

interface AlertProps {
  alertClassName?: string;
  children: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  variant?: "error" | "info" | "success" | "warning";
}

export default function Alert({
  alertClassName,
  children,
  onDismiss,
  variant = "info",
}: AlertProps) {
  alertClassName = joinClassNames(
    classes.alert,
    classes[variant],
    alertClassName
  );
  const buttonClassName = joinClassNames(classes.button, classes[variant]);

  return (
    <div className={alertClassName} role="alert">
      <div>
        {variant === "error" && (
          <AccessibleIcon.Root label="Error">
            <FontAwesomeIcon icon={faCircleExclamation} />
          </AccessibleIcon.Root>
        )}
        {variant === "info" && (
          <AccessibleIcon.Root label="Information">
            <FontAwesomeIcon icon={faCircleInfo} />
          </AccessibleIcon.Root>
        )}
        {variant === "success" && (
          <AccessibleIcon.Root label="Success">
            <FontAwesomeIcon icon={faCircleCheck} />
          </AccessibleIcon.Root>
        )}
        {variant === "warning" && (
          <AccessibleIcon.Root label="Warning">
            <FontAwesomeIcon icon={faCircleExclamation} />
          </AccessibleIcon.Root>
        )}{" "}
        {children}
      </div>

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
