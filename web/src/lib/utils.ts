import { ApiResponse } from "./types";
import { compact, forOwn, head, join, uniq } from "lodash";
import { Dispatch, SetStateAction } from "react";
import {
  FieldError,
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
 * @param {setFormError} callbacks.setFormError - callback from useState()
 * @param {setError} callbacks.setError - callback from useForm()
 */
export function handleApiError<F extends FieldValues>(
  response: ApiResponse,
  {
    setFieldError,
    setFormError,
  }: {
    setFieldError?: UseFormSetError<F>;
    setFormError?: Dispatch<SetStateAction<string | undefined>>;
  } = {}
) {
  if (!response.isError) return;

  if (setFormError) setFormError(response.message);

  if (setFieldError) {
    forOwn(response.errors, (error, fieldName) => {
      const message = head(error);

      if (error) {
        setFieldError(
          fieldName as Path<F>,
          { message, type: "custom" } as FieldError
        );
      }
    });
  }
}
