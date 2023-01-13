import classes from "../styles/components/Breadcrumbs.module.scss";
import { Children, ReactNode } from "react";

interface BreadcrumbsProps {
  children: ReactNode;
}

export default function Breadcrumbs({ children }: BreadcrumbsProps) {
  const crumbs = Children.toArray(children).reduce<ReactNode[]>(
    (elements, child, index) => {
      if (index > 0) {
        elements.push(
          <span className={classes.crumbSeparator} key={`spearator-${index}`}>
            &gt;
          </span>
        );
      }

      elements.push(<span key={`child-${index}`}>{child}</span>);
      return elements;
    },
    []
  );

  return <nav aria-label="Breadcrumbs">{crumbs}</nav>;
}
