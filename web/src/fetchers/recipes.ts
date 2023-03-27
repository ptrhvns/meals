import {
  ApiResponse,
  ApiSendFunction,
  brandSchema,
  equipmentSchema,
  foodSchema,
  ingredientSchema,
  paginationSchema,
  recipeSchema,
  tagSchema,
  timeCategorySchema,
  timeSchema,
  unitSchema,
} from "../lib/types";
import { z } from "zod";

export function brandCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/brand/create/`,
  });
}

export function brandDestroy(
  send: ApiSendFunction,
  { brandId }: { brandId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/brand/${brandId}/destroy/`,
  });
}

export function brandGet(
  send: ApiSendFunction,
  { brandId }: { brandId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ brand: brandSchema }),
    url: `/api/recipes/brand/${brandId}/`,
  });
}

export function brandsGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      brands: z.array(brandSchema),
      pagination: z.optional(paginationSchema),
    }),
    url: `/api/recipes/brands/${queryParam}`,
  });
}

export function brandUpdate(
  send: ApiSendFunction,
  {
    data,
    brandId,
  }: {
    data: { name: string };
    brandId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/brand/${brandId}/update/`,
  });
}

export function equipmentCreate(
  send: ApiSendFunction,
  { data }: { data: { description: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/equipment/create/`,
  });
}

export function equipmentDestroy(
  send: ApiSendFunction,
  { equipmentId }: { equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/equipment/${equipmentId}/destroy/`,
  });
}

export function equipmentManyGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      equipmentMany: z.array(equipmentSchema),
      pagination: z.optional(paginationSchema),
    }),
    url: `/api/recipes/equipment-many/${queryParam}`,
  });
}

export function equipmentLink(
  send: ApiSendFunction,
  {
    data,
    recipeId,
  }: {
    data: { description: string };
    recipeId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/equipment/link/`,
  });
}

export function equipmentOneGet(
  send: ApiSendFunction,
  { equipmentId }: { equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ equipmentOne: equipmentSchema }),
    url: `/api/recipes/equipment-one/${equipmentId}/`,
  });
}

export function equipmentRecipesGet(
  send: ApiSendFunction,
  params: { page?: number; equipmentId: string }
): Promise<ApiResponse> {
  const page = encodeURIComponent(params.page ?? 1);

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: paginationSchema,
      recipes: z.array(recipeSchema),
    }),
    url: `/api/recipes/equipment/${params.equipmentId}/recipes/?page=${page}`,
  });
}

export function equipmentUnlink(
  send: ApiSendFunction,
  { recipeId, equipmentId }: { recipeId: string; equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/equipment/${equipmentId}/unlink/`,
  });
}

export function equipmentUpdate(
  send: ApiSendFunction,
  {
    data,
    equipmentId,
  }: {
    data: { description: string };
    equipmentId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/equipment/${equipmentId}/update/`,
  });
}

export function foodCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/food/create/`,
  });
}

export function foodDestroy(
  send: ApiSendFunction,
  { foodId }: { foodId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/food/${foodId}/destroy/`,
  });
}

export function foodManyGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      foodMany: z.array(foodSchema),
    }),
    url: `/api/recipes/food-many/${queryParam}`,
  });
}

export function foodOneGet(
  send: ApiSendFunction,
  { foodId }: { foodId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ foodOne: foodSchema }),
    url: `/api/recipes/food-one/${foodId}/`,
  });
}

export function foodUpdate(
  send: ApiSendFunction,
  {
    data,
    foodId,
  }: {
    data: { name: string };
    foodId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/food/${foodId}/update/`,
  });
}

export function ingredientCreate(
  send: ApiSendFunction,
  {
    data,
    recipeId,
  }: {
    data: {
      amount?: string;
      brand?: string;
      food: string;
      unit?: string;
    };
    recipeId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/ingredient/create/`,
  });
}

export function ingredientDestroy(
  send: ApiSendFunction,
  { ingredientId }: { ingredientId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/ingredient/${ingredientId}/destroy/`,
  });
}

export function ingredientGet(
  send: ApiSendFunction,
  { ingredientId }: { ingredientId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ ingredient: ingredientSchema }),
    url: `/api/recipes/ingredient/${ingredientId}/`,
  });
}

export function ingredientUpdate(
  send: ApiSendFunction,
  {
    data,
    ingredientId,
  }: {
    data: { amount?: string; brand?: string; food: string; unit?: string };
    ingredientId: string;
  }
) {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/ingredient/${ingredientId}/update/`,
  });
}

export function notesDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/notes/destroy/`,
  });
}

export function notesUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { notes: string }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/notes/update/`,
  });
}

export function ratingDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/rating/destroy/`,
  });
}

export function ratingGet(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ rating: z.object({ rating: z.number() }) }),
    url: `/api/recipes/rating/${recipeId}/`,
  });
}

export function ratingUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { rating: number }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/rating/${recipeId}/update/`,
  });
}

export function recipeCreate(
  send: ApiSendFunction,
  { data }: { data: { title: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/recipes/recipe/create/",
  });
}

export function recipeGet(
  send: ApiSendFunction,
  params: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ recipe: recipeSchema }),
    url: `/api/recipes/recipe/${params.recipeId}/`,
  });
}

export function recipesGet(
  send: ApiSendFunction,
  params: { page?: number }
): Promise<ApiResponse> {
  const page = encodeURIComponent(params.page ?? 1);

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: paginationSchema,
      recipes: z.array(recipeSchema),
    }),
    url: `/api/recipes/recipes/?page=${page}`,
  });
}

export function recipeDestroy(
  send: ApiSendFunction,
  params: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${params.recipeId}/destroy/`,
  });
}

export function recipeTitleUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { title: string }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/title/update/`,
  });
}

export function servingsDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/servings/destroy/`,
  });
}

export function servingsUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { servings: number }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/servings/update/`,
  });
}

export function tagCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/tag/create/`,
  });
}

export function tagDestroy(
  send: ApiSendFunction,
  { tagId }: { tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/tag/${tagId}/destroy/`,
  });
}

export function tagGet(
  send: ApiSendFunction,
  { tagId }: { tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ tag: tagSchema }),
    url: `/api/recipes/tag/${tagId}/`,
  });
}

export function tagLink(
  send: ApiSendFunction,
  {
    data,
    recipeId,
  }: {
    data: { name: string };
    recipeId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/tag/link/`,
  });
}

export function tagsGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: z.optional(paginationSchema),
      tags: z.array(tagSchema),
    }),
    url: `/api/recipes/tags/${queryParam}`,
  });
}

export function tagRecipesGet(
  send: ApiSendFunction,
  params: { page?: number; tagId: string }
): Promise<ApiResponse> {
  const page = encodeURIComponent(params.page ?? 1);

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: paginationSchema,
      recipes: z.array(recipeSchema),
    }),
    url: `/api/recipes/tag/${params.tagId}/recipes/?page=${page}`,
  });
}

export function tagUnlink(
  send: ApiSendFunction,
  { recipeId, tagId }: { recipeId: string; tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/tag/${tagId}/unlink/`,
  });
}

export function tagUpdate(
  send: ApiSendFunction,
  {
    data,
    tagId,
  }: {
    data: { name: string };
    tagId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/tag/${tagId}/update/`,
  });
}

export function timeCategoryGet(
  send: ApiSendFunction,
  { timeCategoryId }: { timeCategoryId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ timeCategory: timeCategorySchema }),
    url: `/api/recipes/time-category/${timeCategoryId}/`,
  });
}

export function timeCategoriesGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      timeCategories: z.array(timeCategorySchema),
    }),
    url: `/api/recipes/time-categories/${queryParam}`,
  });
}

export function timeCategoryCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/time-category/create/`,
  });
}

export function timeCategoryDestroy(
  send: ApiSendFunction,
  { timeCategoryId }: { timeCategoryId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/time-category/${timeCategoryId}/destroy/`,
  });
}

export function timeCategoryUpdate(
  send: ApiSendFunction,
  {
    data,
    timeCategoryId,
  }: {
    data: { name: string };
    timeCategoryId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/time-category/${timeCategoryId}/update/`,
  });
}

export function timeCreate(
  send: ApiSendFunction,
  {
    data,
    recipeId,
  }: {
    data: {
      days: string;
      hours: string;
      minutes: string;
      note: string;
      time_category: { name: string };
    };
    recipeId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/time/create/`,
  });
}

export function timeDestroy(
  send: ApiSendFunction,
  { timeId }: { timeId: string }
) {
  return send({
    method: "POST",
    url: `/api/recipes/time/${timeId}/destroy/`,
  });
}

export function timeGet(
  send: ApiSendFunction,
  { recipeId, timeId }: { recipeId: string; timeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ time: timeSchema }),
    url: `/api/recipes/recipe/${recipeId}/time/${timeId}/`,
  });
}

export function timeUpdate(
  send: ApiSendFunction,
  {
    data,
    recipeId,
    timeId,
  }: {
    data: {
      days: string;
      hours: string;
      minutes: string;
      note: string;
      time_category: { name: string };
    };
    recipeId: string;
    timeId: string;
  }
) {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/recipe/${recipeId}/time/${timeId}/update/`,
  });
}

export function unitCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/unit/create/`,
  });
}

export function unitGet(
  send: ApiSendFunction,
  { unitId }: { unitId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ unit: unitSchema }),
    url: `/api/recipes/unit/${unitId}/`,
  });
}

export function unitsGet(
  send: ApiSendFunction,
  params?: { page?: number }
): Promise<ApiResponse> {
  const queryParam = params?.page ? `?page=${params?.page}` : "";

  return send({
    method: "GET",
    responseDataSchema: z.object({
      units: z.array(unitSchema),
    }),
    url: `/api/recipes/units/${queryParam}`,
  });
}

export function unitDestroy(
  send: ApiSendFunction,
  { unitId }: { unitId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/unit/${unitId}/destroy/`,
  });
}

export function unitUpdate(
  send: ApiSendFunction,
  {
    data,
    unitId,
  }: {
    data: { name: string };
    unitId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipes/unit/${unitId}/update/`,
  });
}
