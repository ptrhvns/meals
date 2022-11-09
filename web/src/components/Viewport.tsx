import { HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Viewport.module.scss";

type ViewportProps = HTMLAttributes<HTMLDivElement>;

export default function Viewport({
  children,
  className,
  ...restProps
}: ViewportProps) {
  className = joinClassNames(classes.viewport, className);

  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
}
