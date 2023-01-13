import classes from "../styles/components/HorizontalRule.module.scss";
import { HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

type HorizontalRuleProps = HTMLAttributes<HTMLHRElement>;

export default function HorizontalRule({
  className,
  ...restProps
}: HorizontalRuleProps) {
  className = joinClassNames(className, classes.horizontalRule);
  return <hr className={className} {...restProps} />;
}
