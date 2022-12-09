import classes from "../styles/components/PageLayout.module.scss";
import Content from "./Content";
import Viewport from "./Viewport";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  containerClassName?: string;
}

export default function PageLayout({
  children,
  containerClassName,
}: PageLayoutProps) {
  const className = joinClassNames(classes.content, containerClassName);

  return (
    <Viewport className={classes.viewport}>
      <Content className={className}>{children}</Content>
    </Viewport>
  );
}
