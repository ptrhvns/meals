import classes from "../styles/components/HRElement.module.scss";
import { HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

type HRElementProps = HTMLAttributes<HTMLHRElement>;

export default function HRElement({ className, ...restProps }: HRElementProps) {
  className = joinClassNames(className, classes.hrelement);
  return <hr className={className} {...restProps} />;
}
