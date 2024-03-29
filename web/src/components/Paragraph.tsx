import classes from "../styles/components/Paragraph.module.scss";
import { HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "dimmed" | "normal";
}

export default function Paragraph({
  children,
  className,
  variant = "normal",
  ...restProps
}: ParagraphProps) {
  className = joinClassNames(classes.paragraph, classes[variant], className);

  return (
    <p className={className} {...restProps}>
      {children}
    </p>
  );
}
