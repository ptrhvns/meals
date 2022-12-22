import classes from "../styles/components/Label.module.scss";
import { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ children, ...restProps }: LabelProps) => {
  return (
    <label className={classes.label} {...restProps}>
      {children}
    </label>
  );
};

export default Label;
