import Label, { LabelProps } from "./Label";

type LabelDivProps = LabelProps;

const LabelDiv = ({ ...restProps }: LabelDivProps) => {
  return (
    <div>
      <Label {...restProps} />
    </div>
  );
};

export default LabelDiv;
