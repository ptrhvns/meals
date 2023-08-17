import DirectionEditForm, {
  DirectionEditFormProps,
} from "../../components/DirectionEditForm";
import useApi from "../../hooks/useApi";
import userEvent from "@testing-library/user-event";
import { act, render, screen, within } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { it, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    directionDestroy: vi.fn(() => Promise.resolve({})),
    directionUpdate: vi.fn(() => Promise.resolve({})),
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
  direction,
  recipeId,
  ...props
}: Partial<DirectionEditFormProps> = {}) {
  direction ||= {
    description: "Cook it.",
    id: "1",
    order: 1,
  };

  return (
    <MemoryRouter>
      <DirectionEditForm
        direction={direction}
        recipeId={recipeId || "1"}
        {...props}
      />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when direction is not given", () => {
  it("renders null", () => {
    render(
      <MemoryRouter>
        <DirectionEditForm recipeId={"1"} />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("direction-edit-form")).toBeFalsy();
  });
});

describe("when `Dismiss` button is clicked", () => {
  it("navigates to `/recipe/${recipeId}`", async () => {
    const navigate = vi.fn();

    // @ts-ignore
    useNavigate.mockReturnValue(navigate);

    const recipeId = "1";

    const user = userEvent.setup();
    render(buildComponent({ recipeId }));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(navigate).toHaveBeenCalledWith(`/recipe/${recipeId}`);
  });
});

describe("when `Update` button is clicked", () => {
  describe("when required fields are empty", () => {
    it("renders field errors", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.clear(screen.getByLabelText("Description"));
      await user.click(screen.getByRole("button", { name: "Update" }));
      expect(screen.getByText("Description is required.")).toBeTruthy();
    });
  });

  describe("when required fields have been filled out", () => {
    it("sends request to API", async () => {
      const directionUpdate = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ directionUpdate });

      const user = userEvent.setup();
      const direction = { description: "Old direction.", id: "1", order: 0 };
      const newDescription = "New direction.";
      render(buildComponent({ direction }));
      const descriptionField = screen.getByLabelText("Description");
      await user.clear(descriptionField);
      await user.type(descriptionField, newDescription);
      await user.click(screen.getByRole("button", { name: "Update" }));

      expect(directionUpdate).toHaveBeenCalledWith({
        data: { description: newDescription },
        directionId: direction.id,
      });
    });

    describe("when API returns success", () => {
      it("navigates to `/recipe/${recipeId}`", async () => {
        const directionUpdate = vi.fn(() => Promise.resolve({}));

        // @ts-ignore
        useApi.mockReturnValue({ directionUpdate });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const recipeId = "1";
        const user = userEvent.setup();
        render(buildComponent({ recipeId }));
        await user.click(screen.getByRole("button", { name: "Update" }));
        expect(navigate).toHaveBeenCalledWith(`/recipe/${recipeId}`, {
          replace: true,
        });
      });
    });

    describe("when API returns failure", () => {
      it("renders form and field errors", async () => {
        const message = "This is an error.";
        const descriptionError = "Description is invalid.";

        const directionUpdate = vi.fn(() =>
          Promise.resolve({
            errors: { description: [descriptionError] },
            isError: true,
            message,
          })
        );

        // @ts-ignore
        useApi.mockReturnValue({ directionUpdate });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        render(buildComponent());
        await user.click(screen.getByRole("button", { name: "Update" }));
        expect(screen.getByText(message)).toBeTruthy();
        expect(screen.getByText(descriptionError)).toBeTruthy();
      });
    });
  });
});

describe("when `Delete` button is clicked", () => {
  it("renders confirmation form", async () => {
    const user = userEvent.setup();
    render(buildComponent());
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByTestId("direction-edit-form-confirmation-form")
    ).toBeTruthy();
  });

  describe("when confirmation form dismiss icon is clicked", () => {
    it("hides confirmation form", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Delete" }));
      await user.click(screen.getByTestId("dialog-dismiss-button"));

      expect(
        screen.queryByTestId("direction-edit-form-confirmation-form")
      ).toBeFalsy();
    });
  });

  describe("when the confirmation form `Dismiss` button is clicked", () => {
    it("hides confirmation form", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Delete" }));
      const confirmationFormId = "direction-edit-form-confirmation-form";
      const confirmationForm = screen.getByTestId(confirmationFormId);

      await user.click(
        within(confirmationForm).getByRole("button", { name: "Dismiss" })
      );

      expect(
        screen.queryByTestId("direction-edit-form-confirmation-form")
      ).toBeFalsy();
    });
  });
});

describe("when confirmation form `Delete` button is clicked", () => {
  it("sends request to API", async () => {
    const directionDestroy = vi.fn(() => Promise.resolve({}));

    // @ts-ignore
    useApi.mockReturnValue({ directionDestroy });

    const user = userEvent.setup();

    const direction = {
      description: "Cook it.",
      id: "1",
      order: 1,
    };

    render(buildComponent({ direction }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const confirmationFormId = "direction-edit-form-confirmation-form";
    const confirmationForm = screen.getByTestId(confirmationFormId);

    await user.click(
      within(confirmationForm).getByRole("button", { name: "Delete" })
    );

    expect(directionDestroy).toHaveBeenCalledWith({
      directionId: direction.id,
    });
  });

  describe("when API returns success", () => {
    it("navigates to `/recipe/${recipeId}`", async () => {
      const directionDestroy = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ directionDestroy });

      const navigate = vi.fn();

      // @ts-ignore
      useNavigate.mockReturnValue(navigate);

      const recipeId = "1";
      const user = userEvent.setup();
      render(buildComponent({ recipeId }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      const confirmationFormId = "direction-edit-form-confirmation-form";
      const confirmationForm = screen.getByTestId(confirmationFormId);

      await user.click(
        within(confirmationForm).getByRole("button", { name: "Delete" })
      );

      expect(navigate).toHaveBeenCalledWith(`/recipe/${recipeId}`, {
        replace: true,
      });
    });
  });

  describe("when API returns failure", () => {
    it("renders error", async () => {
      const message = "This is an error.";

      const directionDestroy = vi.fn(() =>
        Promise.resolve({
          isError: true,
          message,
        })
      );

      // @ts-ignore
      useApi.mockReturnValue({ directionDestroy });

      const navigate = vi.fn();

      // @ts-ignore
      useNavigate.mockReturnValue(navigate);

      const recipeId = "1";
      const user = userEvent.setup();
      render(buildComponent({ recipeId }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      const confirmationFormId = "direction-edit-form-confirmation-form";
      const confirmationForm = screen.getByTestId(confirmationFormId);

      await user.click(
        within(confirmationForm).getByRole("button", { name: "Delete" })
      );

      expect(screen.getByText(message)).toBeTruthy();
    });
  });
});
