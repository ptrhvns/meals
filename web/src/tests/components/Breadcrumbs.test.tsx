import Breadcrumbs, { BreadcrumbsProps } from "../../components/Breadcrumbs";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";

function buildComponent({
  children,
  ...props
}: Partial<BreadcrumbsProps> = {}) {
  return <Breadcrumbs {...props}>{children || <div />}</Breadcrumbs>;
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

it("renders `children`", () => {
  render(
    <Breadcrumbs>
      <div>Bread</div>
      <div>Crumb</div>
      <div>Elements</div>
    </Breadcrumbs>
  );

  expect(screen.getByText("Bread")).toBeTruthy();
  expect(screen.getByText("Crumb")).toBeTruthy();
  expect(screen.getByText("Elements")).toBeTruthy();
});
