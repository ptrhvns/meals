import { joinClassNames } from "../lib/utils";
import { Link } from "react-router-dom";

import classes from "../styles/components/Anchor.module.scss";

type LinkProps = Parameters<typeof Link>[0];

interface AnchorProps extends LinkProps {
  color?: "blue" | "primary" | "red";
  variant?: "filled" | "link";
}

export default function Anchor({
  children,
  className,
  color = "primary",
  variant = "link",
  ...restProps
}: AnchorProps) {
  className = joinClassNames(className, classes[color], classes[variant]);

  return (
    <Link className={className} {...restProps}>
      {children}
    </Link>
  );
}
