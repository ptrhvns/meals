import classes from "../styles/components/Content.module.scss";
import { HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

type ContentProps = HTMLAttributes<HTMLDivElement>;

export default function Content({
  children,
  className,
  ...restProps
}: ContentProps) {
  className = joinClassNames(classes.content, className);

  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
}
