import { debounce } from "lodash";
import { useRef } from "react";

export function useDebouncedFunction(
  wait: number,
  fn: (...args: any) => any
): (...args: any) => any {
  return useRef(debounce(fn, wait)).current;
}
