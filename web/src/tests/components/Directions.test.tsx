import Directions, { DirectionsProps } from "../../components/Directions";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

function buildComponent({
  dispatch,
  recipe,
  ...props
}: Partial<DirectionsProps> = {}) {
  dispatch ||= vi.fn();
  recipe ||= { id: "1", title: "Biscuits" };

  return (
    <MemoryRouter>
      <Directions dispatch={dispatch} recipe={recipe} {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when recipe is not given", () => {
  it("renders null", () => {
    render(
      <MemoryRouter>
        <Directions dispatch={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("direction-edit-form")).toBeFalsy();
  });
});
