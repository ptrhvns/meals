import ScreenReaderOnly from "./ScreenReaderOnly";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";
import { MouseEventHandler, ReactNode } from "react";

import classes from "../styles/components/Alert.module.scss";

interface AlertProps {
  children: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  variant: "error";
}

export default function Alert({ children, onDismiss, variant }: AlertProps) {
  const alertClassName = joinClassNames(classes.alert, classes[variant]);
  const buttonClassName = joinClassNames(classes.button, classes[variant]);

  return (
    <div className={alertClassName} role="alert">
      <div>{children}</div>

      {onDismiss && (
        <div>
          <button className={buttonClassName} onClick={onDismiss} type="button">
            <FontAwesomeIcon icon={faTimes} />
            <ScreenReaderOnly>Dismiss</ScreenReaderOnly>
          </button>
        </div>
      )}
    </div>
  );
}
