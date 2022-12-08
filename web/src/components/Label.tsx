import classes from "../styles/components/Label.module.scss";
import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ children, ...restProps }: LabelProps) => {
  return (
    <div>
      <label className={classes.label} {...restProps}>
        {children}
      </label>
    </div>
  );
};

export default Label;
