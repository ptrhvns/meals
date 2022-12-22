import Input, { InputProps } from "./Input";
import { forwardRef } from "react";

type DivInputProps = InputProps;

const DivInput = forwardRef<HTMLInputElement, DivInputProps>(
  ({ ...restProps }: DivInputProps, ref) => {
    return (
      <div>
        <Input ref={ref} {...restProps} />
      </div>
    );
  }
);

DivInput.displayName = "DivInput";

export default DivInput;
