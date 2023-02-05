import Sublabel, { SublabelProps } from "./Sublabel";

type SublabelDivProps = SublabelProps;

export default function SublabelDiv({ children }: SublabelDivProps) {
  return (
    <div>
      <Sublabel>{children}</Sublabel>
    </div>
  );
}
