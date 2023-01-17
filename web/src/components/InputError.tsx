import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import classes from "../styles/components/InputError.module.scss";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputErrorProps {
  error?: string;
}

const InputError = ({ error }: InputErrorProps) => {
  if (!error) return null;

  return (
    <div className={classes.wrapper}>
      <AccessibleIcon.Root label="Error">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </AccessibleIcon.Root>{" "}
      {error}
    </div>
  );
};

export default InputError;
