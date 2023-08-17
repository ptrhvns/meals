import DirectionNewForm, {
  DirectionNewFormProps,
} from "../../components/DirectionNewForm";
import useApi from "../../hooks/useApi";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { it, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    directionCreate: vi.fn(() => Promise.resolve({})),
  })),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = (await importOriginal()) as object;

  return {
    ...mod,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

function buildComponent({
  recipeId,
  ...props
}: Partial<DirectionNewFormProps> = {}) {
  return (
    <MemoryRouter>
      <DirectionNewForm recipeId={recipeId || "1"} {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when user clicks on `Dismiss` button", () => {
  it("navigates to `/recipe/${recipeId}`", async () => {
    const navigate = vi.fn();

    // @ts-ignore
    useNavigate.mockReturnValue(navigate);

    const user = userEvent.setup();
    const recipeId = "1";
    render(buildComponent({ recipeId }));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(navigate).toHaveBeenCalledWith(`/recipe/${recipeId}`);
  });
});

describe("when user clicks on `Create` button", () => {
  describe("when fields are empty", () => {
    it("renders field errors", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Create" }));
      expect(screen.getByText("Description is required.")).toBeTruthy();
    });
  });

  describe("when fields are filled out", () => {
    it("sends request to API", async () => {
      const directionCreate = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ directionCreate });

      const user = userEvent.setup();
      const recipeId = "1";
      render(buildComponent({ recipeId }));
      const description = "Cook it.";
      await user.type(screen.getByLabelText("Description"), description);
      await user.click(screen.getByRole("button", { name: "Create" }));

      expect(directionCreate).toHaveBeenCalledWith({
        data: { description },
        recipeId,
      });
    });

    describe("when API returns success", () => {
      it("navigates to `/recipe/${recipeId}`", async () => {
        const directionCreate = vi.fn(() => Promise.resolve({}));

        // @ts-ignore
        useApi.mockReturnValue({ directionCreate });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        const recipeId = "1";
        render(buildComponent({ recipeId }));
        await user.type(screen.getByLabelText("Description"), "Cook it.");
        await user.click(screen.getByRole("button", { name: "Create" }));
        expect(navigate).toHaveBeenCalledWith(`/recipe/${recipeId}`, {
          replace: true,
        });
      });
    });

    describe("when API returns failure", () => {
      it("renders form and field errors", async () => {
        const message = "This is an error.";
        const descriptionError = "Description is invalid.";

        const directionCreate = vi.fn(() =>
          Promise.resolve({
            errors: { description: [descriptionError] },
            isError: true,
            message,
          })
        );

        // @ts-ignore
        useApi.mockReturnValue({ directionCreate });

        const user = userEvent.setup();
        render(buildComponent());
        await user.type(screen.getByLabelText("Description"), "Cook it.");
        await user.click(screen.getByRole("button", { name: "Create" }));
        expect(screen.getByText(message)).toBeTruthy();
        expect(screen.getByText(descriptionError)).toBeTruthy();
      });
    });
  });
});
