import classes from "../styles/components/StrikethroughCheckbox.module.scss";
import Input from "./Input";
import LabelDiv from "./LabelDiv";
import { joinClassNames } from "../lib/utils";
import { useState } from "react";

interface StrikethroughCheckboxProps {
  itemId: string;
  label: string;
}

export default function StrikethroughCheckbox({
  itemId,
  label,
}: StrikethroughCheckboxProps) {
  const [checked, setChecked] = useState<boolean>(false);

  const labelClassName = joinClassNames(
    classes.checkboxLabel,
    checked ? classes.checked : null
  );

  return (
    <LabelDiv className={labelClassName} htmlFor={itemId} key={itemId}>
      <Input
        id={itemId}
        onChange={() => setChecked((prev) => !prev)}
        type="checkbox"
      />
      <span className={classes.checkboxContent}>{label}</span>
    </LabelDiv>
  );
}
