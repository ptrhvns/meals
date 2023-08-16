import classes from "../../styles/components/Combobox.module.scss";
import Combobox, { ComboboxProps } from "../../components/Combobox";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

function buildComponent({
  clearErrors,
  error,
  options,
  setValue,
  ...props
}: Partial<ComboboxProps> = {}) {
  return (
    <Combobox
      clearErrors={clearErrors || (() => {})}
      error={Boolean(error)}
      options={options || ["First option"]}
      setValue={setValue || (() => {})}
      {...props}
    />
  );
}

it("renders successfully", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() => root.render(buildComponent()));
});

describe("when `error` prop is `true`", () => {
  describe("when input has focus", () => {
    it("renders combobox input wrapper with focused error style", () => {
      render(buildComponent({ error: true }));
      act(() => screen.getByRole("combobox").focus());
      expect(screen.getByTestId("combobox-input-wrapper").className).toMatch(
        classes.inputWrapperErrorFocus
      );
    });
  });

  describe("when input does not have focus", () => {
    it("renders combobox input wrapper with unfocused error style", () => {
      render(buildComponent({ error: true }));
      expect(screen.getByTestId("combobox-input-wrapper").className).toMatch(
        classes.inputWrapperErrorNoFocus
      );
    });
  });
});

describe("when `error` prop is `false`", () => {
  describe("when input has focus", () => {
    it("renders combobox input wrapper with focused style", () => {
      render(buildComponent({ error: false }));
      act(() => screen.getByRole("combobox").focus());
      expect(screen.getByTestId("combobox-input-wrapper").className).toMatch(
        classes.inputWrapperFocus
      );
    });
  });

  describe("when input does not have focus", () => {
    it("renders combobox input wrapper with unfocused style", () => {
      render(buildComponent({ error: false }));
      expect(screen.getByTestId("combobox-input-wrapper").className).toMatch(
        classes.inputWrapperNoFocus
      );
    });
  });
});

describe("when listbox is open", () => {
  it("renders input with `aria-activedescendant` attribute", () => {
    render(buildComponent());
    act(() => screen.getByRole("combobox").focus());
    expect(
      screen.getByRole("combobox").getAttribute("aria-activedescendant")
    ).toMatch(/listbox-item-\S+-active/);
  });
});

describe("when listbox is not open", () => {
  it("renders input without `aria-activedescendant` attribute", () => {
    render(buildComponent());
    expect(
      screen.getByRole("combobox").getAttribute("aria-activedescendant")
    ).toBeNull();
  });
});

describe("when `error` prop is true", () => {
  it("renders input with error style", () => {
    render(buildComponent({ error: true }));
    expect(screen.getByRole("combobox").className).toMatch(classes.inputError);
  });
});

describe("when `error` prop is false", () => {
  it("renders input without error style", () => {
    render(buildComponent({ error: false }));
    expect(screen.getByRole("combobox").className).not.toMatch(
      classes.inputError
    );
  });
});

describe("when user triggers focus event on input", () => {
  it("opens listbox", () => {
    render(buildComponent());
    act(() => screen.getByRole("combobox").focus());
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});

describe("when user triggers blur event on input", () => {
  describe("when `onBlur` prop is given", () => {
    it("calls `onBlur` prop with blur event", () => {
      const onBlur = vi.fn();
      render(buildComponent({ onBlur }));
      act(() => {
        screen.getByRole("combobox").focus();
        screen.getByRole("combobox").blur();
      });
      expect(onBlur).toHaveBeenCalled();
    });
  });
});

describe("when user triggers change event on input", () => {
  it("opens listbox", async () => {
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot", "banana"] }));
    await user.type(screen.getByRole("combobox"), "ap");
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  describe("when input is not empty", () => {
    it("filters listbox options to match input", async () => {
      const user = userEvent.setup();
      render(buildComponent({ options: ["apple", "apricot", "banana"] }));
      await user.type(screen.getByRole("combobox"), "ap");
      const options = screen.getAllByRole("option").map((o) => o.textContent);
      expect(options.sort()).toEqual(["apple", "apricot"]);
    });
  });

  describe("when input is empty", () => {
    it("renders full list of listbox options", async () => {
      const user = userEvent.setup();
      render(buildComponent({ options: ["apple", "apricot", "banana"] }));
      const combobox = screen.getByRole("combobox");
      await user.type(combobox, "ap");
      await user.clear(combobox);
      const options = screen.getAllByRole("option").map((o) => o.textContent);
      expect(options.sort()).toEqual(["apple", "apricot", "banana"]);
    });
  });
});

describe("when user triggers `ArrowDown` event on input", () => {
  describe("when listbox has options", () => {
    describe("when listbox is open", () => {
      it("moves the active listbox option forward by one", async () => {
        const user = userEvent.setup();
        render(buildComponent({ options: ["apple", "apricot", "banana"] }));
        const combobox = screen.getByRole("combobox");
        act(() => combobox.focus());
        await user.type(combobox, "{arrowdown}");
        const options = screen.getAllByRole("option");
        expect(options[0].getAttribute("aria-selected")).toBeTruthy();
      });

      describe("when active listbox option is last one", () => {
        it("sets active listbox option to first one", async () => {
          const user = userEvent.setup();
          render(buildComponent({ options: ["apple", "apricot"] }));
          const combobox = screen.getByRole("combobox");
          act(() => combobox.focus());
          await user.type(combobox, "{arrowdown}{arrowdown}{arrowdown}");
          const options = screen.getAllByRole("option");
          expect(options[0].getAttribute("aria-selected")).toBeTruthy();
        });
      });
    });

    describe("when listbox is closed", () => {
      it("sets active listbox option to the first one", async () => {
        const user = userEvent.setup();
        render(buildComponent({ options: ["apple", "apricot"] }));
        await user.type(screen.getByRole("combobox"), "{arrowdown}");
        const options = screen.getAllByRole("option");
        expect(options[0].getAttribute("aria-selected")).toBeTruthy();
      });
    });
  });
});

describe("when user triggers `ArrowUp` event on input", () => {
  describe("when listbox has options", () => {
    describe("when listbox is open", () => {
      it("moves the active listbox option backward by one", async () => {
        const user = userEvent.setup();
        render(buildComponent({ options: ["apple", "apricot"] }));
        const combobox = screen.getByRole("combobox");
        act(() => combobox.focus());
        await user.type(combobox, "{arrowup}");
        const options = screen.getAllByRole("option");
        expect(
          options[options.length - 1].getAttribute("aria-selected")
        ).toBeTruthy();
      });

      describe("when active listbox option is first one", () => {
        it("sets active listbox option to last one", async () => {
          const user = userEvent.setup();
          render(buildComponent({ options: ["apple", "apricot"] }));
          const combobox = screen.getByRole("combobox");
          act(() => combobox.focus());
          await user.type(combobox, "{arrowup}{arrowup}{arrowup}");
          const options = screen.getAllByRole("option");
          expect(
            options[options.length - 1].getAttribute("aria-selected")
          ).toBeTruthy();
        });
      });
    });

    describe("when listbox is closed", () => {
      it("sets active listbox option to the last one", async () => {
        const user = userEvent.setup();
        render(buildComponent({ options: ["apple", "apricot"] }));
        await user.type(screen.getByRole("combobox"), "{arrowup}");
        const options = screen.getAllByRole("option");
        expect(
          options[options.length - 1].getAttribute("aria-selected")
        ).toBeTruthy();
      });
    });
  });
});

describe("when user triggers `Enter` event on input", () => {
  it("sets value of input to active option", async () => {
    const setValue = vi.fn();
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot"], setValue }));
    const combobox = screen.getByRole("combobox") as HTMLInputElement;
    await user.type(combobox, "{arrowdown}{enter}");
    const lastCallIndex = setValue.mock.calls.length - 1;
    expect(setValue.mock.calls[lastCallIndex]).toEqual(["apple"]);
  });

  it("closes inputbox", async () => {
    const user = userEvent.setup();
    render(
      buildComponent({ options: ["apple", "apricot"], setValue: vi.fn() })
    );
    await user.type(screen.getByRole("combobox"), "{arrowdown}{enter}");
    expect(screen.queryByRole("listbox")).toBeFalsy();
  });
});

describe("when user triggers `Escape` event on input", () => {
  describe("when listbox is open", () => {
    it("closes listbox", async () => {
      const user = userEvent.setup();
      render(buildComponent());
      const combobox = screen.getByRole("combobox");
      act(() => combobox.focus());
      await user.type(combobox, "{escape}");
      expect(screen.queryByRole("listbox")).toBeFalsy();
    });
  });
});

describe("when user clicks open listbox icon", () => {
  it("triggers focus event on input", async () => {
    const user = userEvent.setup();
    render(buildComponent());
    await user.click(screen.getByRole("button", { name: "Open Listbox" }));
    expect(document.activeElement).toEqual(screen.getByRole("combobox"));
  });

  it("opens listbox", async () => {
    const user = userEvent.setup();
    render(buildComponent());
    await user.click(screen.getByRole("button", { name: "Open Listbox" }));
    expect(screen.getByRole("combobox")).toBeTruthy();
  });
});

describe("when listbox option is active", () => {
  it("renders option with `aria-selected` attribute", async () => {
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot"] }));
    await user.type(screen.getByRole("combobox"), "{arrowdown}");
    expect(
      screen.getAllByRole("option")[0].getAttribute("aria-selected")
    ).toBeTruthy();
  });

  it("renders option with active styles", async () => {
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot"] }));
    await user.type(screen.getByRole("combobox"), "{arrowdown}");
    expect(screen.getAllByRole("option")[0].className).toMatch(
      classes.listboxItemActive
    );
  });
});

describe("when listbox option is not active", () => {
  it("renders option without `aria-selected` attribute", async () => {
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot"] }));
    await user.type(screen.getByRole("combobox"), "{arrowdown}");
    expect(
      screen.getAllByRole("option")[1].getAttribute("aria-selected")
    ).not.toMatch(classes.listboxItemActive);
  });

  it("renders option with without active styles", async () => {
    const user = userEvent.setup();
    render(buildComponent({ options: ["apple", "apricot"] }));
    await user.type(screen.getByRole("combobox"), "{arrowdown}");
    expect(screen.getAllByRole("option")[1].className).not.toMatch(
      classes.listboxItemActive
    );
  });
});

describe("when user clicks on listbox option", () => {
  it("sets value of input to clicked option", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(buildComponent({ options: ["apple", "apricot"], setValue }));
    act(() => screen.getByRole("combobox").focus());
    await user.click(screen.getAllByRole("option")[1]);
    expect(setValue).toHaveBeenCalledWith("apricot");
  });

  it("closes inputbox", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(buildComponent({ options: ["apple", "apricot"], setValue }));
    act(() => screen.getByRole("combobox").focus());
    await user.click(screen.getAllByRole("option")[1]);
    expect(screen.queryByRole("listbox")).toBeFalsy();
  });
});
