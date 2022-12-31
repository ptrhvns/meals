import classes from "../styles/components/Table.module.scss";
import { forwardRef, InputHTMLAttributes } from "react";
import { joinClassNames } from "../lib/utils";

export interface TableProps extends InputHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, striped = false, ...restProps }: TableProps, ref) => {
    className = joinClassNames(
      classes.table,
      className,
      striped ? classes.striped : undefined
    );

    return (
      <table className={className} ref={ref} {...restProps}>
        {children}
      </table>
    );
  }
);

Table.displayName = "Table";

export default Table;
