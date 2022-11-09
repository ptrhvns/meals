import Content from "./Content";
import Viewport from "./Viewport";
import { joinClassNames } from "../lib/utils";
import { ReactNode } from "react";

import classes from "../styles/components/Hero.module.scss";

interface HeroProps {
  children?: ReactNode;
  contentClassName?: string;
  viewportClassName?: string;
}

export default function Hero({
  children,
  contentClassName,
  viewportClassName,
}: HeroProps) {
  contentClassName = joinClassNames(classes.content, contentClassName);
  viewportClassName = joinClassNames(classes.viewport, viewportClassName);

  return (
    <Viewport className={viewportClassName}>
      <Content className={contentClassName}>
        <div className={classes.wrapper}>{children}</div>
      </Content>
    </Viewport>
  );
}
