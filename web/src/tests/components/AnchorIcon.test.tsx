import AnchorIcon, { AnchorIconProps } from "../../components/AnchorIcon";
import { createRoot } from "react-dom/client";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { it } from "vitest";
import { MemoryRouter } from "react-router-dom";

function buildComponent({
  icon,
  label,
  to,
  ...props
}: Partial<AnchorIconProps> = {}) {
  return (
    <MemoryRouter>
      <AnchorIcon
        icon={icon || faCircleCheck}
        label={label || "Test Label"}
        to={to || "/example"}
        {...props}
      />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(buildComponent());
});
