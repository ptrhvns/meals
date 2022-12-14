import classes from "../styles/components/Breadcrumbs.module.scss";
import { Children, ReactNode } from "react";

interface BreadcrumbsProps {
  children: ReactNode;
}

export default function Breadcrumbs({ children }: BreadcrumbsProps) {
  return (
    <div>
      {Children.toArray(children).reduce<ReactNode[]>(
        (elements, child, index) => {
          elements.push(
            <span className={classes.child} key={index}>
              {child}
            </span>
          );
          return elements;
        },
        []
      )}
    </div>
  );
}
