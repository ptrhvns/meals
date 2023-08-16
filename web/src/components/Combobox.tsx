import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import Button from "./Button";
import classes from "../styles/components/Combobox.module.scss";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty, isNumber } from "lodash";
import { joinClassNames } from "../lib/utils";
import { Optional } from "../lib/types";

export interface ComboboxProps extends InputHTMLAttributes<HTMLInputElement> {
  clearErrors: () => void;
  error: boolean;
  options: string[];
  setValue: (arg: string) => void;
}

interface ReducerState {
  inputBlurEvent: Optional<FocusEvent<HTMLInputElement, Element>>;
  listboxOpen: boolean;
  matchActiveIndex: Optional<number>;
  matches: string[];
}

type ReducerAction =
  | { type: "arrowDown" }
  | { type: "arrowUp" }
  | { type: "blurCombobox"; payload: FocusEvent<HTMLInputElement, Element> }
  | { type: "changeInput"; payload: string }
  | { type: "closeListbox" }
  | { type: "focusCombobox" }
  | { type: "selectMatch"; payload?: number };

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      className,
      clearErrors,
      error,
      name,
      onBlur,
      onChange,
      options,
      setValue,
      ...restProps
    }: ComboboxProps,
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const matchActiveRef = useRef<HTMLLIElement | null>(null);
    const randomId = useMemo(() => Math.random().toString(36).slice(2, 6), []);

    const [{ listboxOpen, matchActiveIndex, matches }, dispatch] = useReducer(
      (state: ReducerState, action: ReducerAction): ReducerState => {
        let matchActiveIndex;
        let matches;

        switch (action.type) {
          case "arrowDown":
            if (state.matches.length < 1) return state;

            matchActiveIndex = 0;

            if (state.listboxOpen) {
              matchActiveIndex = (state.matchActiveIndex ?? -1) + 1;
            }

            if (matchActiveIndex >= state.matches.length) {
              matchActiveIndex = state.matches.length - 1;
            }

            setTimeout(() => matchActiveRef.current?.scrollIntoView?.());
            return { ...state, listboxOpen: true, matchActiveIndex };
          case "arrowUp":
            if (state.matches.length < 1) return state;

            matchActiveIndex = state.matches.length - 1;

            if (state.listboxOpen) {
              matchActiveIndex =
                (state.matchActiveIndex ?? state.matches.length) - 1;
            }

            if (matchActiveIndex <= 0) {
              matchActiveIndex = 0;
            }

            setTimeout(() => matchActiveRef.current?.scrollIntoView?.());
            return { ...state, listboxOpen: true, matchActiveIndex };
          case "blurCombobox":
            onBlur?.(action.payload);

            return {
              ...state,
              inputBlurEvent: null,
              listboxOpen: false,
              matchActiveIndex: null,
            };
          case "changeInput":
            matches = options;

            if (!isEmpty(action.payload)) {
              matches = options.filter((o) =>
                o.toLowerCase().includes(action.payload.toLowerCase())
              );
            }

            return {
              ...state,
              listboxOpen: true,
              matchActiveIndex: null,
              matches,
            };
          case "closeListbox":
            return { ...state, matchActiveIndex: null, listboxOpen: false };
          case "focusCombobox":
            if (inputRef.current) inputRef.current.focus();
            return { ...state, listboxOpen: true };
          case "selectMatch":
            if (isNumber(action.payload)) {
              setValue(state.matches[action.payload]);
            } else if (isNumber(state.matchActiveIndex)) {
              setValue(state.matches[state.matchActiveIndex]);
            }

            setTimeout(() => clearErrors());

            return {
              ...state,
              listboxOpen: false,
              matchActiveIndex: null,
            };
          default:
            // istanbul ignore next -- @preserve
            return state;
        }
      },
      {
        inputBlurEvent: null,
        listboxOpen: false,
        matchActiveIndex: null,
        matches: options,
      }
    );

    const listboxId = `listbox-${randomId}`;

    return (
      <>
        <div
          data-testid="combobox-input-wrapper"
          className={(() => {
            let extraClassName;

            if (error) {
              extraClassName =
                inputRef.current === document.activeElement
                  ? classes.inputWrapperErrorFocus
                  : classes.inputWrapperErrorNoFocus;
            } else {
              extraClassName =
                inputRef.current === document.activeElement
                  ? classes.inputWrapperFocus
                  : classes.inputWrapperNoFocus;
            }

            return joinClassNames(classes.inputWrapper, extraClassName);
          })()}
        >
          <input
            aria-activedescendant={
              listboxOpen ? `listbox-item-${listboxId}-active` : undefined
            }
            aria-autocomplete="list"
            aria-controls={`listbox-${listboxId}`}
            aria-expanded={listboxOpen}
            className={joinClassNames(
              classes.input,
              error ? classes.inputError : undefined,
              className
            )}
            name={name}
            onBlur={(event) =>
              dispatch({ type: "blurCombobox", payload: event })
            }
            onChange={(event) => {
              dispatch({ type: "changeInput", payload: event.target.value });
              onChange?.(event);
            }}
            onFocus={() => dispatch({ type: "focusCombobox" })}
            onKeyDown={(event) => {
              switch (event.key) {
                case "ArrowDown":
                  event.preventDefault();
                  dispatch({ type: "arrowDown" });
                  break;
                case "ArrowUp":
                  event.preventDefault();
                  dispatch({ type: "arrowUp" });
                  break;
                case "Enter":
                  if (listboxOpen && !isEmpty(matches)) {
                    event.preventDefault();
                    dispatch({ type: "selectMatch" });
                  }

                  break;
                case "Escape":
                  if (listboxOpen) {
                    event.preventDefault();
                    dispatch({ type: "closeListbox" });
                  }

                  break;
              }
            }}
            ref={(element) => {
              inputRef.current = element;

              // istanbul ignore if -- @preserve
              if (typeof ref === "function") {
                ref(element);
              } else if (ref) {
                // istanbul ignore next -- @preserve
                ref.current = element;
              }
            }}
            role="combobox"
            {...restProps}
          />
          <Button
            className={classes.inputButton}
            onClick={() => dispatch({ type: "focusCombobox" })}
            tabIndex={-1}
            type="button"
            variant="unstyled"
          >
            <AccessibleIcon.Root label="Open Listbox">
              <FontAwesomeIcon icon={faChevronDown} />
            </AccessibleIcon.Root>
          </Button>
        </div>

        {listboxOpen && !isEmpty(matches) && (
          <div className={classes.listboxWrapper}>
            <ul
              onMouseDown={(event) => event.preventDefault()}
              className={classes.listbox}
              id={`listbox-${listboxId}`}
              role="listbox"
              tabIndex={-1}
            >
              {matches.map((match, index) => (
                <li
                  aria-selected={index === matchActiveIndex ? true : false}
                  id={
                    index === matchActiveIndex
                      ? `listbox-item-${listboxId}-active`
                      : undefined
                  }
                  className={joinClassNames(
                    classes.listboxItem,
                    index === matchActiveIndex
                      ? classes.listboxItemActive
                      : undefined
                  )}
                  key={index}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    dispatch({ type: "selectMatch", payload: index });
                  }}
                  ref={index === matchActiveIndex ? matchActiveRef : null}
                  role="option"
                  tabIndex={-1}
                >
                  {match}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
);

Combobox.displayName = "Combobox";

export default Combobox;
