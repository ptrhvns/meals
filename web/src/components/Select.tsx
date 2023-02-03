import classes from "../styles/components/Select.module.scss";
import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, error, ...restProps }: SelectProps, ref) => {
    className = joinClassNames(
      classes.select,
      error ? classes.error : undefined,
      className
    );

    return (
      <select className={className} ref={ref} {...restProps}>
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
