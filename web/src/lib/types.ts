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

// Ensure this matches BrandData.
export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches brandSchema.
export interface BrandData {
  id: string;
  name: string;
}

// Ensure this matches EquipmentData.
export const equipmentSchema = z.object({
  id: z.string(),
  description: z.string(),
});

// Ensure this matches equipmentSchema.
export interface EquipmentData {
  id: string;
  description: string;
}

// Ensure this matches FoodData.
export const foodSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches foodSchema.
export interface FoodData {
  id: string;
  name: string;
}

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

// Ensure this matches UnitsData.
export const unitSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Ensure this matches unitsSchema.
export interface UnitData {
  id: string;
  name: string;
}

// Ensure this matches IngredientData.
export const ingredientSchema = z.object({
  amount: z.optional(z.number()),
  brand: z.optional(brandSchema),
  food: foodSchema,
  id: z.string(),
  order: z.number(),
  unit: z.optional(unitSchema),
});

// Ensure this matches ingredientSchema.
export interface IngredientData {
  amount?: number;
  brand?: BrandData;
  food: FoodData;
  id: string;
  order: number;
  unit?: UnitData;
}

// Ensure this matches RecipeData.
export const recipeSchema = z.object({
  equipment: z.optional(z.array(equipmentSchema)),
  id: z.string(),
  ingredients: z.optional(z.array(ingredientSchema)),
  notes: z.optional(z.string()),
  rating: z.optional(z.number()),
  servings: z.optional(z.number()),
  tags: z.optional(z.array(tagSchema)),
  times: z.optional(z.array(timeSchema)),
  title: z.string(),
});

// Ensure this matches recipeSchema.
export interface RecipeData {
  equipment?: EquipmentData[];
  id: string;
  ingredients: IngredientData[];
  notes?: string;
  rating?: number;
  servings?: number;
  tags?: TagData[];
  times?: TimeData[];
  title: string;
}

export type RecipeReducerAction =
  | { type: "setRecipe"; payload: RecipeData }
  | { type: "unlinkEquipment"; payload: string }
  | { type: "unlinkTag"; payload: string };
