import AccountDeleteForm from "../../components/AccountDeleteForm";
import AuthnProvider from "../../providers/AuthnProvider";
import useApi from "../../hooks/useApi";
import useAuthn from "../../hooks/useAuthn";
import userEvent from "@testing-library/user-event";
import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useApi", () => ({
  // @ts-ignore
  default: vi.fn(() => ({ accountDestroy: vi.fn(() => ({})) })),
}));

vi.mock("../../hooks/useAuthn", () => ({
  // @ts-ignore
  default: vi.fn(() => ({ logout: vi.fn() })),
}));

afterEach(() => {
  vi.clearAllMocks();
});

function buildComponent(props = {}) {
  return (
    <AuthnProvider>
      <MemoryRouter>
        <AccountDeleteForm {...props} />
      </MemoryRouter>
    </AuthnProvider>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when user clicks `Delete account` button", () => {
  describe("when `Password` field is empty", () => {
    it("renders error", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Delete account" }));
      screen.getByText("Password is required.");
    });
  });

  describe("when `Password` field is filled out", () => {
    it("renders confirmation form", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.type(screen.getByLabelText("Password"), "alongpassword");
      await user.click(screen.getByRole("button", { name: "Delete account" }));
      expect(
        screen.queryByTestId("account-delete-form-confirmation-form")
      ).toBeTruthy();
    });
  });
});

describe("when user clicks `Dismiss` button on confirmation form", () => {
  it("hides confirmation form", async () => {
    const user = userEvent.setup();
    render(buildComponent());
    await user.type(screen.getByLabelText("Password"), "alongpassword");
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const confirmationFormId = "account-delete-form-confirmation-form";
    const confirmationForm = screen.getByTestId(confirmationFormId);
    await user.click(
      within(confirmationForm).getByRole("button", { name: "Dismiss" })
    );
    expect(screen.queryByTestId(confirmationFormId)).not.toBeTruthy();
  });
});

describe("when user clicks dismiss icon on confirmation dialog", () => {
  it("hides confirmation form", async () => {
    const user = userEvent.setup();
    render(buildComponent());
    await user.type(screen.getByLabelText("Password"), "alongpassword");
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(screen.getByTestId("dialog-dismiss-button"));
    expect(
      screen.queryByTestId("account-delete-form-confirmation-form")
    ).not.toBeTruthy();
  });
});

describe("when user clicks `Delete` button on confirmation form", () => {
  it("sends request to the API", async () => {
    const accountDestroy = vi.fn(() => Promise.resolve({}));

    // @ts-ignore
    useApi.mockReturnValue({ accountDestroy });

    const logout = vi.fn();

    // @ts-ignore
    useAuthn.mockReturnValue({ logout });

    const user = userEvent.setup();
    render(buildComponent());
    const password = "alongpassword";
    await user.type(screen.getByLabelText("Password"), password);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(accountDestroy).toHaveBeenCalledWith({ data: { password } });
  });

  describe("when response from API is an error", () => {
    it("hides confirmation form and renders errors", async () => {
      const message = "This is an error.";
      const passwordError = "Invalid password.";
      const accountDestroy = vi.fn(() =>
        Promise.resolve({
          errors: { password: [passwordError] },
          isError: true,
          message,
        })
      );

      // @ts-ignore
      useApi.mockReturnValue({ accountDestroy });

      const user = userEvent.setup();
      render(buildComponent());
      await user.type(screen.getByLabelText("Password"), "alongpassword");
      await user.click(screen.getByRole("button", { name: "Delete account" }));
      await user.click(screen.getByRole("button", { name: "Delete" }));
      expect(
        screen.queryByTestId("account-delete-form-confirmation-form")
      ).not.toBeTruthy();
      expect(screen.getByText(message)).toBeTruthy();
      expect(screen.getByText(passwordError)).toBeTruthy();
    });
  });
});
