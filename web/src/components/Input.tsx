import classes from "../styles/components/Input.module.scss";
import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  wrap?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, error = false, wrap = true, ...restProps }: InputProps,
    ref
  ) => {
    className = joinClassNames(
      classes.input,
      error ? classes.error : undefined,
      className
    );

    if (!wrap) {
      return <input className={className} ref={ref} {...restProps} />;
    }

    return (
      <div>
        <input className={className} ref={ref} {...restProps} />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
