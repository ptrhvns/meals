import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import classes from "../styles/components/InputError.module.scss";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinClassNames } from "../lib/utils";

interface InputErrorProps {
  className?: string;
  error?: string;
}

const InputError = ({ className, error }: InputErrorProps) => {
  if (!error) return null;

  return (
    <div className={joinClassNames(classes.wrapper, className)}>
      <AccessibleIcon.Root label="Error">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </AccessibleIcon.Root>{" "}
      {error}
    </div>
  );
};

export default InputError;
