import { HTMLAttributes } from "react";

type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

export default function Paragraph({ children, ...restProps }: ParagraphProps) {
  return <p {...restProps}>{children}</p>;
}
