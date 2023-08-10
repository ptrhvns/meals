import LoginForm from "../../components/LoginForm";
import useApi from "../../hooks/useApi";
import useAuthn from "../../hooks/useAuthn";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router";

vi.mock("../../hooks/useApi", () => ({
  default: vi.fn(() => ({
    login: vi.fn(() => Promise.resolve({})),
  })),
}));

vi.mock("../../hooks/useAuthn", () => ({
  default: vi.fn(() => ({
    login: vi.fn(),
  })),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

function buildComponent(props = {}) {
  return (
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when `Log in` button is clicked", () => {
  describe("when required fields are empty", () => {
    it("renders field errors", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Log in" }));
      expect(screen.getByText("Username is required.")).toBeTruthy();
      expect(screen.getByText("Password is required.")).toBeTruthy();
    });
  });

  describe("when required fields are filled out", () => {
    it("sends request to the API", async () => {
      const login = vi.fn(() => Promise.resolve({}));

      // @ts-ignore
      useApi.mockReturnValue({ login });

      const user = userEvent.setup();
      render(buildComponent());
      await user.click(screen.getByRole("button", { name: "Log in" }));
      const username = "smith";
      await user.type(screen.getByLabelText("Username"), username);
      const password = "alongpassword";
      await user.type(screen.getByLabelText("Password"), password);
      // Remember me field is already checked by default.
      await user.click(screen.getByRole("button", { name: "Log in" }));

      expect(login).toHaveBeenCalledWith({
        data: {
          password,
          remember_me: true,
          username,
        },
      });
    });

    describe("when API responds with errors", () => {
      it("renders form and field errors", async () => {
        const message = "This is an error.";

        const errors = {
          password: ["Password is invalid."],
          username: ["Username is invalid."],
        };

        const login = vi.fn(() =>
          Promise.resolve({ errors, isError: true, message })
        );

        // @ts-ignore
        useApi.mockReturnValue({ login });
        const user = userEvent.setup();
        render(buildComponent());
        await user.type(screen.getByLabelText("Username"), "smith");
        await user.type(screen.getByLabelText("Password"), "alongpassword");
        await user.click(screen.getByRole("button", { name: "Log in" }));
        expect(screen.getByText(message)).toBeTruthy();
        expect(screen.getByText(errors.password[0])).toBeTruthy();
        expect(screen.getByText(errors.username[0])).toBeTruthy();
      });
    });

    describe("when API responds with success", () => {
      it("logs user in on front end and navigates user to `/dashboard`", async () => {
        const apiLogin = vi.fn(() => Promise.resolve({}));

        // @ts-ignore
        useApi.mockReturnValue({ login: apiLogin });

        const authnLogin = vi.fn();

        // @ts-ignore
        useAuthn.mockReturnValue({ login: authnLogin });

        const navigate = vi.fn();

        // @ts-ignore
        useNavigate.mockReturnValue(navigate);

        const user = userEvent.setup();
        render(buildComponent());
        await user.type(screen.getByLabelText("Username"), "smith");
        await user.type(screen.getByLabelText("Password"), "alongpassword");
        await user.click(screen.getByRole("button", { name: "Log in" }));
        expect(authnLogin).toHaveBeenCalled();
        authnLogin.mock.calls[0][0]();
        expect(navigate).toHaveBeenCalledWith("/dashboard", { replace: true });
      });
    });
  });
});
