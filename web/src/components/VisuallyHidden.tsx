import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";

interface VisuallyHiddenProps {
  children: ReactNode;
  show?: boolean;
}

export default function VisuallyHidden({
  children,
  show = false,
}: VisuallyHiddenProps) {
  if (show) return <>{children}</>;

  return (
    <VisuallyHiddenPrimitive.Root>{children}</VisuallyHiddenPrimitive.Root>
  );
}
