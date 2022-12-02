import { ButtonHTMLAttributes, forwardRef } from "react";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Button.module.scss";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "primary" | "slate";
  variant?: "filled" | "light" | "unstyled";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color = "slate",
      variant = "light",
      ...restProps
    }: ButtonProps,
    ref
  ) => {
    className = joinClassNames(
      className,
      classes.button,
      classes[color],
      classes[variant]
    );

    return (
      <button className={className} ref={ref} {...restProps}>
        {children}
      </button>
    );
  }
);

export default Button;
