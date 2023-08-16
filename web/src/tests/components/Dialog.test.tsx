import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { Dialog, DialogContent } from "../../components/Dialog";
import { it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

function buildComponent(props = {}) {
  return (
    <Dialog open={true}>
      <DialogContent {...props} />
    </Dialog>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when `onDismiss` prop is given", () => {
  it("renders `Dismiss` icon button", () => {
    render(buildComponent({ onDismiss: vi.fn() }));
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
  });

  describe("when user clicks on `Dismiss` icon button", () => {
    it("calls `onDismiss` prop", async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(buildComponent({ onDismiss }));
      await user.click(screen.getByRole("button", { name: "Dismiss" }));
      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
