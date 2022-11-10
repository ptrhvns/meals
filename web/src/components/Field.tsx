import { ReactNode } from "react";

import classes from "../styles/components/Field.module.scss";

interface FieldProps {
  children?: ReactNode;
}

const Field = ({ children }: FieldProps) => {
  return <div className={classes.field}>{children}</div>;
};

export default Field;
