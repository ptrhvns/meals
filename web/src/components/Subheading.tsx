import classes from "../styles/components/Subheading.module.scss";
import Paragraph from "./Paragraph";
import { ReactNode } from "react";

interface SubheadingProps {
  children: ReactNode;
}

export default function Subheading({ children }: SubheadingProps) {
  return <Paragraph className={classes.subheading}>{children}</Paragraph>;
}
