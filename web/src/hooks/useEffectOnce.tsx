import { AnyFunction } from "../lib/types";
import { useEffect, useRef } from "react";

export function useEffectOnce(callback: AnyFunction, dependencies: Array<any>) {
  const shouldUseEffect = useRef<boolean>(true);

  useEffect(() => {
    if (shouldUseEffect.current) {
      shouldUseEffect.current = false;
      callback();
    }
  }, dependencies);
}
