import { z } from "zod";

export type AnyFunction = (...args: any[]) => any;

export type FirstParameter<F extends AnyFunction> = Parameters<F>[0];

export type Optional<T> = T | undefined | null;

// Ensure zod validation in useApi() matches any changes here.
export interface ApiResponse {
  data?: any;
  errors?: { [key: string]: string[] };
  isError?: boolean;
  message?: string;
}

export interface ApiSendParameter {
  data?: object;
  headers_init?: object;
  method: "GET" | "POST";
  responseDataSchema?: z.AnyZodObject;
  url: string;
}

export type ApiSendFunction = (param: ApiSendParameter) => Promise<ApiResponse>;
