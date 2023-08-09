import BrandEditForm, {
  BrandEditFormProps,
} from "../../components/BrandEditForm";
import useApi from "../../hooks/useApi";
import userEvent from "@testing-library/user-event";
import { act, render, screen, within } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    brandDestroy: vi.fn(() => Promise.resolve({})),
    brandUpdate: vi.fn(() => Promise.resolve({})),
  })),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = (await importOriginal()) as object;
  return {
    ...mod,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

function buildComponent({ brand }: BrandEditFormProps = {}) {
  return (
    <MemoryRouter>
      <BrandEditForm brand={brand} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when the `Update` button is clicked", () => {
  it("sends a request to the API", async () => {
    const brandUpdate = vi.fn(() => Promise.resolve({}));

    // @ts-ignore
    useApi.mockReturnValue({ brandUpdate });

    const user = userEvent.setup();
    const brandId = "1";
    render(buildComponent({ brand: { id: brandId, name: "OldName" } }));
    const name = "NewName";
    const input = screen.getByLabelText("Name");
    await user.clear(input);
    await user.type(input, name);
    await user.click(screen.getByRole("button", { name: "Update" }));
    expect(brandUpdate).toHaveBeenCalledWith({ brandId, data: { name } });
  });

  describe("when the API returns success", () => {
    it("navigates to `/dashboard/brands`", async () => {
      const brandUpdate = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ brandUpdate });

      const navigate = vi.fn();

      // @ts-ignore
      useNavigate.mockReturnValue(navigate);

      const user = userEvent.setup();
      render(buildComponent({ brand: { id: "1", name: "Acme" } }));
      const input = screen.getByLabelText("Name");
      await user.clear(input);
      await user.type(input, "Acme");
      await user.click(screen.getByRole("button", { name: "Update" }));
      expect(navigate).toHaveBeenCalledWith("/dashboard/brands", {
        replace: true,
      });
    });
  });

  describe("when the API returns errors", () => {
    it("renders form and field errors", async () => {
      const message = "This is an error.";
      const nameError = "Invalid password.";
      const brandUpdate = vi.fn(() =>
        Promise.resolve({
          errors: { name: [nameError] },
          isError: true,
          message,
        })
      );

      // @ts-ignore
      useApi.mockReturnValue({ brandUpdate });

      const user = userEvent.setup();
      render(buildComponent({ brand: { id: "1", name: "Acme" } }));
      const input = screen.getByLabelText("Name");
      await user.clear(input);
      await user.type(input, "Acme");
      await user.click(screen.getByRole("button", { name: "Update" }));
      expect(screen.getByText(message)).toBeTruthy();
      expect(screen.getByText(nameError)).toBeTruthy();
    });
  });
});

describe("when the `Dismiss button is clicked`", () => {
  it("navigates the user", async () => {
    const navigate = vi.fn();

    // @ts-ignore
    useNavigate.mockReturnValue(navigate);
    const user = userEvent.setup();
    render(buildComponent({ brand: { id: "1", name: "Acme" } }));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(navigate).toHaveBeenCalledWith("/dashboard/brands");
  });
});

describe("when the `Delete` button is clicked", () => {
  it("renders the confirmation form", async () => {
    const user = userEvent.setup();
    render(buildComponent({ brand: { id: "1", name: "Acme" } }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      screen.queryByTestId("brand-edit-form-confirmation-form")
    ).toBeTruthy();
  });

  describe("when the confirmation dismiss icon is clicked", () => {
    it("hides confirmation form", async () => {
      const user = userEvent.setup();
      render(buildComponent({ brand: { id: "1", name: "Acme" } }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      await user.click(screen.getByTestId("dialog-dismiss-button"));
      expect(
        screen.queryByTestId("brand-edit-form-confirmation-form")
      ).not.toBeTruthy();
    });
  });

  describe("when the confirmation `Dismiss` button is clicked", () => {
    it("hides confirmation form", async () => {
      const user = userEvent.setup();
      render(buildComponent({ brand: { id: "1", name: "Acme" } }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      const confirmationFormId = "brand-edit-form-confirmation-form";
      const confirmationForm = screen.getByTestId(confirmationFormId);
      await user.click(
        within(confirmationForm).getByRole("button", { name: "Dismiss" })
      );
      expect(
        screen.queryByTestId("brand-edit-form-confirmation-form")
      ).not.toBeTruthy();
    });
  });

  describe("when the confirmation `Delete` button is clicked", () => {
    it("sends a request to the API", async () => {
      const brandDestroy = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ brandDestroy });
      const user = userEvent.setup();
      const brandId = "1";
      render(buildComponent({ brand: { id: brandId, name: "Acme" } }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      const confirmationFormId = "brand-edit-form-confirmation-form";
      const confirmationForm = screen.getByTestId(confirmationFormId);
      await user.click(
        within(confirmationForm).getByRole("button", { name: "Delete" })
      );
      expect(brandDestroy).toHaveBeenCalledWith({ brandId });
    });

    describe("when the API returns success", () => {
      it("navigates to `/dashboard/brands`", async () => {
        const brandDestroy = vi.fn(() => Promise.resolve({}));

        // @ts-ignore
        useApi.mockReturnValue({ brandDestroy });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        render(buildComponent({ brand: { id: "1", name: "Acme" } }));
        await user.click(screen.getByRole("button", { name: "Delete" }));
        const confirmationFormId = "brand-edit-form-confirmation-form";
        const confirmationForm = screen.getByTestId(confirmationFormId);
        await user.click(
          within(confirmationForm).getByRole("button", { name: "Delete" })
        );
        expect(navigate).toHaveBeenCalledWith("/dashboard/brands", {
          replace: true,
        });
      });
    });

    describe("when the API returns errors", () => {
      it("renders errors", async () => {
        const message = "This is an error.";
        const brandDestroy = vi.fn(() =>
          Promise.resolve({
            isError: true,
            message,
          })
        );

        // @ts-ignore
        useApi.mockReturnValue({ brandDestroy });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        render(buildComponent({ brand: { id: "1", name: "Acme" } }));
        await user.click(screen.getByRole("button", { name: "Delete" }));
        const confirmationFormId = "brand-edit-form-confirmation-form";
        const confirmationForm = screen.getByTestId(confirmationFormId);
        await user.click(
          within(confirmationForm).getByRole("button", { name: "Delete" })
        );
        expect(screen.getByText(message)).toBeTruthy();
      });
    });
  });
});
