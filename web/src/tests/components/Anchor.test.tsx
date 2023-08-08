import Anchor, { AnchorProps } from "../../components/Anchor";
import { createRoot } from "react-dom/client";
import { it } from "vitest";
import { MemoryRouter } from "react-router-dom";

function buildComponent({ to, ...props }: Partial<AnchorProps> = {}) {
  return (
    <MemoryRouter>
      <Anchor to={to || "/example"} {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(buildComponent());
});
