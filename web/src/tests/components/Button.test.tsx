import Button from "../../components/Button";
import { act } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { it } from "vitest";

function buildComponent(props = {}) {
  return <Button {...props} />;
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});
