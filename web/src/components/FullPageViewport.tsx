import classes from "../styles/components/FullPageViewport.module.scss";
import Viewport, { ViewportProps } from "./Viewport";
import { ReactNode } from "react";

interface FullPageViewportProps extends ViewportProps {
  children?: ReactNode;
}

export default function FullPageViewport({ children }: FullPageViewportProps) {
  return <Viewport className={classes.viewport}>{children}</Viewport>;
}
