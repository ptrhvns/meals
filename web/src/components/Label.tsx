import { LabelHTMLAttributes } from "react";

import classes from "../styles/components/Label.module.scss";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ children, ...restProps }: LabelProps) => {
  return (
    <div className={classes.wrapper}>
      <label {...restProps}>{children}</label>
    </div>
  );
};

export default Label;
