import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { MouseEventHandler, ReactNode } from "react";

import classes from "../styles/components/Alert.module.scss";

interface AlertProps {
  children: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  variant: "error" | "success";
}

export default function Alert({ children, onDismiss, variant }: AlertProps) {
  const alertClassName = joinClassNames(classes.alert, classes[variant]);
  const buttonClassName = joinClassNames(classes.button, classes[variant]);

  return (
    <div className={alertClassName} role="alert">
      <div>{children}</div>

      {onDismiss && (
        <div>
          <button
            aria-label="Dismiss"
            className={buttonClassName}
            onClick={onDismiss}
            title="Dismiss"
            type="button"
          >
            <AccessibleIcon.Root label="Dismiss">
              <FontAwesomeIcon icon={faTimes} />
            </AccessibleIcon.Root>
          </button>
        </div>
      )}
    </div>
  );
}
