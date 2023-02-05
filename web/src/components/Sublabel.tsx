import classes from "../styles/components/Sublabel.module.scss";
import { ReactNode } from "react";

export interface SublabelProps {
  children: ReactNode;
}

export default function Sublabel({ children }: SublabelProps) {
  return <span className={classes.sublabel}>{children}</span>;
}
