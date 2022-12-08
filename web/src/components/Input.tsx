import classes from "../styles/components/Input.module.scss";
import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  wrap?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, wrap = true, ...restProps }: InputProps, ref) => {
    const className = joinClassNames(
      classes.input,
      error ? classes.error : undefined
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
