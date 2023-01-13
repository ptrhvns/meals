import classes from "../styles/components/RecipeSectionHeading.module.scss";
import Heading from "./Heading";
import { ReactNode } from "react";

interface RecipeSectionHeadingProps {
  children?: ReactNode;
  heading: string;
}

export default function RecipeSectionHeading({
  heading,
  children = null,
}: RecipeSectionHeadingProps) {
  return (
    <div className={classes.wrapper}>
      <Heading className={classes.heading}>{heading}</Heading>
      {children}
    </div>
  );
}
