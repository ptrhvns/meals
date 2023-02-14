import classes from "../styles/components/Textarea.module.scss";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...restProps }: TextareaProps, ref) => {
    className = joinClassNames(
      classes.textarea,
      error ? classes.error : undefined,
      className
    );

    return <textarea className={className} ref={ref} {...restProps}></textarea>;
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
