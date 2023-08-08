import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Anchor, { AnchorProps } from "./Anchor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface AnchorIconProps extends AnchorProps {
  icon: IconProp;
  label: string;
}

export default function AnchorIcon({
  icon,
  label,
  ...restProps
}: AnchorIconProps) {
  return (
    <Anchor {...restProps}>
      <AccessibleIcon.Root label={label}>
        <FontAwesomeIcon icon={icon} title={label} />
      </AccessibleIcon.Root>
    </Anchor>
  );
}
