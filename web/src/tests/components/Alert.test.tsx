import Alert, { AlertProps } from "../../components/Alert";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

function buildComponent({ children, ...props }: Partial<AlertProps> = {}) {
  return <Alert {...props}>{children || <div />}</Alert>;
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

it("renders correct icon for `error` variant", () => {
  render(buildComponent({ variant: "error" }));
  expect(screen.getByTestId("alert-icon-error")).toBeTruthy();
});

it("renders correct icon for `info` variant", () => {
  render(buildComponent({ variant: "info" }));
  expect(screen.getByTestId("alert-icon-info")).toBeTruthy();
});

it("renders correct icon for `success` variant", () => {
  render(buildComponent({ variant: "success" }));
  expect(screen.getByTestId("alert-icon-success")).toBeTruthy();
});

it("renders correct icon for `warning` variant", () => {
  render(buildComponent({ variant: "warning" }));
  expect(screen.getByTestId("alert-icon-warning")).toBeTruthy();
});

describe("when `onDismiss` prop is given", () => {
  it("renders `Dismiss` button and calls `onDismiss` prop", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(buildComponent({ onDismiss }));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
