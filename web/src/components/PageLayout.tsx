import classes from "../styles/components/PageLayout.module.scss";
import Content from "./Content";
import Viewport from "./Viewport";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  containerClassName?: string;
  variant?: "narrow" | "normal";
}

export default function PageLayout({
  children,
  containerClassName,
  variant = "normal",
}: PageLayoutProps) {
  containerClassName = joinClassNames(
    classes.content,
    classes[variant],
    containerClassName
  );

  return (
    <Viewport className={classes.viewport}>
      <Content className={containerClassName}>{children}</Content>
    </Viewport>
  );
}
