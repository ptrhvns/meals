import classes from "../styles/components/Input.module.scss";
import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, ...restProps }: InputProps, ref) => {
    className = joinClassNames(
      classes.input,
      error ? classes.error : undefined,
      className
    );

    return <input className={className} ref={ref} {...restProps} />;
  }
);

Input.displayName = "Input";

export default Input;
