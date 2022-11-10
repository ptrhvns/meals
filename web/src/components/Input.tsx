import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, ...restProps }: InputProps, ref) => {
    const className = joinClassNames(
      classes.input,
      error ? classes.error : undefined
    );

    return (
      <div>
        <input className={className} ref={ref} {...restProps} />
      </div>
    );
  }
);

export default Input;
