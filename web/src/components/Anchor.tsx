import classes from "../styles/components/Anchor.module.scss";
import { joinClassNames } from "../lib/utils";
import { Link } from "react-router-dom";

type LinkProps = Parameters<typeof Link>[0];

interface AnchorProps extends LinkProps {
  color?: "blue" | "grass" | "primary" | "red";
  variant?: "filled" | "light" | "link";
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
