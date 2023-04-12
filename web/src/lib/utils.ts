import { ApiResponse, Optional } from "./types";
import {
  compact,
  forOwn,
  head,
  isArray,
  isPlainObject,
  join,
  uniq,
} from "lodash";
import { Dispatch, SetStateAction } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetError,
} from "react-hook-form";

export function buildTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - Meal Gizmo` : "Meal Gizmo";
}

export function joinClassNames(...args: Optional<string>[]): string {
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
    (function processFieldErrors(
      errors: ApiResponse["errors"],
      pathElements: string[] = []
    ) {
      forOwn(errors, (errorValue, pathElement) => {
        const newPathElements = [...pathElements, pathElement];

        if (isPlainObject(errorValue)) {
          processFieldErrors(errorValue, newPathElements);
        } else if (isArray(errorValue)) {
          const message = head(errorValue);
          const path = join(newPathElements, ".");

          setFieldError(
            path as Path<F>,
            { message, type: "custom" } as FieldError
          );
        }
      });
    })(response.errors);
  }
}
