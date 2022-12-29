import { ApiResponse } from "./types";
import { compact, forOwn, head, join, uniq } from "lodash";
import { Dispatch, SetStateAction } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form";

export function buildTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - Meals` : "Meals";
}

export function joinClassNames(...args: (string | undefined | null)[]): string {
  return join(uniq(compact(args)), " ");
}

export function handleApiError<F extends FieldValues>(
  response: ApiResponse,
  {
    setError,
    setFieldError,
  }: {
    setError?: Dispatch<SetStateAction<string | undefined>>;
    setFieldError?: UseFormSetError<F>;
  } = {}
) {
  if (!response.isError) return;

  if (setError) setError(response.message);

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
