import { ApiResponse, Optional } from "./types";
import { compact, forOwn, head, join, uniq } from "lodash";
import {
  ErrorOption,
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form";

/**
 * Build a string to use in a <title> tag.
 *
 * @param {string} [subtitle] - caller defined part of the title
 * @returns {string} full string to use in <title>
 */
export function buildTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - Meals` : "Meals";
}

/**
 * Join className strings together
 *
 * @param {(string | undefined)[]} args - variadic list of classNames
 * @returns {string} classNames joined together
 */
export function joinClassNames(...args: (string | undefined)[]): string {
  return join(uniq(compact(args)), " ");
}

/**
 * Parse an API response and call given callbacks to set errors.
 *
 * @template F - field values used with useForm()
 * @param {ApiResponse} response - response from call a useApi() function
 * @param {callbacks} [callbacks] - object of callbacks used to set errors
 * @param {setAlert} callbacks.setAlert - callback from useState()
 * @param {setError} callbacks.setError - callback from useForm()
 */
export function handleApiError<F extends FieldValues>(
  response: ApiResponse,
  {
    setAlert,
    setError,
  }: {
    setAlert?: (s: Optional<string>) => void;
    setError?: UseFormSetError<F>;
  } = {}
) {
  if (!response.isError) return;

  if (setAlert) setAlert(response.message);

  if (setError) {
    forOwn(response.errors, (error, fieldName) => {
      const err = head(error);

      if (error) {
        setError(fieldName as Path<F>, err as ErrorOption);
      }
    });
  }
}