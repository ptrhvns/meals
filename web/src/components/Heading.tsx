import classes from "../styles/components/Heading.module.scss";
import { ComponentType, forwardRef, HTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
}

type TagName = ComponentType | keyof JSX.IntrinsicElements;

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, size = 1, ...restProps }, ref) => {
    const HeadingElement: TagName = `h${size}`;

    return (
      <HeadingElement
        className={joinClassNames(classes.heading, className)}
        ref={ref}
        {...restProps}
      >
        {children}
      </HeadingElement>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
