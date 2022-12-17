import classes from "../styles/components/RecipeSection.module.scss";
import Content from "./Content";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

interface RecipeSectionProps {
  children: ReactNode;
  containerClassName?: string;
}

export default function RecipeSection({
  children,
  containerClassName,
}: RecipeSectionProps) {
  containerClassName = joinClassNames(classes.content, containerClassName);

  return (
    <Content className={containerClassName}>{children}</Content>
  );
}
