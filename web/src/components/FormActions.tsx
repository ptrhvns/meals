import { ReactNode } from "react";

import classes from "../styles/components/FormActions.module.scss";

interface FormActionsProps {
  children: ReactNode;
}

const FormActions = ({ children }: FormActionsProps) => {
  return <div className={classes.wrapper}>{children}</div>;
};

export default FormActions;
