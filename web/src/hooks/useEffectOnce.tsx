import { AnyFunction } from "../lib/types";
import { useEffect } from "react";

export function useEffectOnce(callback: AnyFunction, cleanup?: AnyFunction) {
  useEffect(() => {
    callback();
    return cleanup;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
