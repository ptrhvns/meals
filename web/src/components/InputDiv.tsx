import Input, { InputProps } from "./Input";
import { forwardRef } from "react";

type InputDivProps = InputProps;

const InputDiv = forwardRef<HTMLInputElement, InputDivProps>(
  ({ ...restProps }: InputDivProps, ref) => {
    return (
      <div>
        <Input ref={ref} {...restProps} />
      </div>
    );
  }
);

InputDiv.displayName = "InputDiv";

export default InputDiv;
