import { z } from "zod";

export type AnyFunction = (...args: any[]) => any;

export type FirstParameter<F extends AnyFunction> = Parameters<F>[0];

export type Optional<T> = T | undefined | null;

// Ensure this matches apiResponseSchema in useApi hook.
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

// Ensure this matches PaginationData below.
export const paginationSchema = z.object({
  page: z.number(),
  total: z.number(),
});

// Ensure this matches paginationSchema above.
export interface PaginationData {
  page: number;
  total: number;
}

// Ensure this matches TagData below.
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches tagSchema above.
export interface TagData {
  id: string;
  name: string;
}

// Ensure this matches RecipeData below.
export const recipeSchema = z.object({
  id: z.string(),
  tags: z.optional(z.array(tagSchema)),
  title: z.string(),
});

// Ensure this matches recipeSchema above.
export interface RecipeData {
  id: string;
  tags?: TagData[];
  title: string;
}

export type RecipeReducerAction =
  | { type: "deleteTag"; payload: string }
  | { type: "setRecipe"; payload: RecipeData };
