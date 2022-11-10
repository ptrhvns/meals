import { ButtonHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Button.module.scss";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "primary" | "slate";
  variant?: "filled" | "light";
}

const Button = ({
  children,
  className,
  color = "slate",
  variant = "light",
  ...restProps
}: ButtonProps) => {
  className = joinClassNames(
    className,
    classes.button,
    classes[color],
    classes[variant]
  );

  return (
    <button className={className} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
