import classes from "../styles/components/Field.module.scss";
import { ReactNode } from "react";

interface FieldProps {
  children?: ReactNode;
}

const Field = ({ children }: FieldProps) => {
  return <div className={classes.field}>{children}</div>;
};

export default Field;
