import { ComponentType, HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

import classes from "../styles/components/Heading.module.scss";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
}

type TagName = ComponentType | keyof JSX.IntrinsicElements;

export default function Heading({
  children,
  className,
  size = 1,
  ...restProps
}: HeadingProps) {
  const HeadingElement: TagName = `h${size}`;

  return (
    <HeadingElement
      className={joinClassNames(classes.heading, className)}
      {...restProps}
    >
      {children}
    </HeadingElement>
  );
}
