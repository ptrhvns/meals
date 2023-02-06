import { z } from "zod";

export type AnyFunction = (...args: any[]) => any;

export type FirstParameter<F extends AnyFunction> = Parameters<F>[0];
export type SecondParameter<F extends AnyFunction> = Parameters<F>[1];

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

// Ensure this matches PaginationData.
export const paginationSchema = z.object({
  page: z.number(),
  total: z.number(),
});

// Ensure this matches paginationSchema.
export interface PaginationData {
  page: number;
  total: number;
}

// Ensure this matches TagData.
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches tagSchema.
export interface TagData {
  id: string;
  name: string;
}

// Ensure this matches TimeCategoryData.
export const timeCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches timeCategorySchema.
export interface TimeCategoryData {
  id: string;
  name: string;
}

// Ensure this matches TimeData.
export const timeSchema = z.object({
  id: z.string(),
  days: z.optional(z.number()),
  hours: z.optional(z.number()),
  minutes: z.optional(z.number()),
  note: z.optional(z.string()),
  time_category: timeCategorySchema,
});

// Ensure this matches timeSchema.
export interface TimeData {
  days?: number;
  hours?: number;
  id: string;
  minutes?: number;
  note?: string;
  time_category: TimeCategoryData;
}

// Ensure this matches RecipeData.
export const recipeSchema = z.object({
  id: z.string(),
  rating: z.optional(z.number()),
  tags: z.optional(z.array(tagSchema)),
  times: z.optional(z.array(timeSchema)),
  title: z.string(),
});

// Ensure this matches recipeSchema.
export interface RecipeData {
  id: string;
  rating?: number;
  tags?: TagData[];
  times?: TimeData[];
  title: string;
}

export type RecipeReducerAction =
  | { type: "setRecipe"; payload: RecipeData }
  | { type: "unlinkTag"; payload: string };
