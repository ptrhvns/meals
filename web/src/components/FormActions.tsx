import classes from "../styles/components/FormActions.module.scss";
import { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
}

const FormActions = ({ children }: FormActionsProps) => {
  return <div className={classes.wrapper}>{children}</div>;
};

export default FormActions;
