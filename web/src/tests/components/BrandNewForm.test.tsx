import BrandNewForm from "../../components/BrandNewForm";
import useApi from "../../hooks/useApi";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    brandCreate: vi.fn(() => Promise.resolve({})),
  })),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = (await importOriginal()) as object;

  return {
    ...mod,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

function buildComponent(props = {}) {
  return (
    <MemoryRouter>
      <BrandNewForm {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when `Dismiss` button is clicked", () => {
  it("navigates to `/dashboard/brands`", async () => {
    const navigate = vi.fn();

    // @ts-ignore
    useNavigate.mockReturnValue(navigate);

    const user = userEvent.setup();
    render(buildComponent());
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(navigate).toHaveBeenCalledWith("/dashboard/brands");
  });
});

describe("when the `Create` button is clicked", () => {
  describe("when the form has not been filled in", () => {
    it("renders form errors", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Create" }));
      expect(screen.getByText("Name is required.")).toBeTruthy();
    });
  });

  describe("when the form has been filled in", () => {
    it("sends a request to the API", async () => {
      const name = "Acme";
      const brandCreate = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ brandCreate });

      const user = userEvent.setup();
      render(buildComponent());
      await user.type(screen.getByLabelText("Name"), name);
      await user.click(screen.getByRole("button", { name: "Create" }));
      expect(brandCreate).toHaveBeenCalledWith({ data: { name } });
    });

    describe("when the API responds with errors", () => {
      it("renders form and field errors", async () => {
        const message = "This is an error.";
        const nameError = "Name is invalid.";

        const brandCreate = vi.fn(() =>
          Promise.resolve({
            errors: { name: [nameError] },
            isError: true,
            message,
          })
        );

        // @ts-ignore
        useApi.mockReturnValue({ brandCreate });

        const user = userEvent.setup();
        render(buildComponent());
        const name = "Acme";
        await user.type(screen.getByLabelText("Name"), name);
        await user.click(screen.getByRole("button", { name: "Create" }));
        expect(screen.getByText(message)).toBeTruthy();
        expect(screen.getByText(nameError)).toBeTruthy();
      });
    });

    describe("when the API responds with success", () => {
      it("navigates to `/dashboard/brands`", async () => {
        const name = "Acme";
        const brandCreate = vi.fn(() => Promise.resolve({}));

        // @ts-ignore
        useApi.mockReturnValue({ brandCreate });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        render(buildComponent());
        await user.type(screen.getByLabelText("Name"), name);
        await user.click(screen.getByRole("button", { name: "Create" }));

        expect(navigate).toHaveBeenCalledWith("/dashboard/brands", {
          replace: true,
        });
      });
    });
  });
});
