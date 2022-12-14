import classes from "../styles/components/PageLayoutHeading.module.scss";
import Heading from "./Heading";
import { ReactNode } from "react";

interface PageLayoutHeadingProps {
  children: ReactNode;
}

// Use this to avoid extra space at the top of a PageLayout component.
export default function PageLayoutHeading({
  children,
}: PageLayoutHeadingProps) {
  return <Heading className={classes.heading}>{children}</Heading>;
}
