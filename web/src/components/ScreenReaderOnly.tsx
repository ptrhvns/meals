import { ReactNode } from "react";

import classes from "../styles/components/ScreenReaderOnly.module.scss";

interface ScreenReaderOnlyProps {
  children: ReactNode;
}

export default function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return <span className={classes.wrapper}>{children}</span>;
}
