import Label, { LabelProps } from "./Label";

type DivLabelProps = LabelProps;

const DivLabel = ({ ...restProps }: DivLabelProps) => {
  return (
    <div>
      <Label {...restProps} />
    </div>
  );
};

export default DivLabel;
