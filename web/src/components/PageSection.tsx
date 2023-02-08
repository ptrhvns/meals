import classes from "../styles/components/PageSection.module.scss";
import Content from "./Content";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  variant?: "narrow" | "normal";
}

export default function PageSection({
  children,
  className,
  variant = "normal",
}: PageSectionProps) {
  className = joinClassNames(classes.content, classes[variant], className);

  return <Content className={className}>{children}</Content>;
}
