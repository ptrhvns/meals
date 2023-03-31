import {
  ApiResponse,
  ApiSendFunction,
  brandSchema,
  directionSchema,
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

export function accountDestroy(
  send: ApiSendFunction,
  { data }: { data: { password: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/account/destroy/",
  });
}

export function brandCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/brand/create/`,
  });
}

export function brandDestroy(
  send: ApiSendFunction,
  { brandId }: { brandId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/brand/${brandId}/destroy/`,
  });
}

export function brandGet(
  send: ApiSendFunction,
  { brandId }: { brandId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ brand: brandSchema }),
    url: `/api/brand/${brandId}/`,
  });
}

export function brandRecipesGet(
  send: ApiSendFunction,
  params: { page?: number; brandId: string }
): Promise<ApiResponse> {
  const page = encodeURIComponent(params.page ?? 1);

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: paginationSchema,
      recipes: z.array(recipeSchema),
    }),
    url: `/api/brand/${params.brandId}/recipes/?page=${page}`,
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
    url: `/api/brands/${queryParam}`,
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
    url: `/api/brand/${brandId}/update/`,
  });
}

export function directionCreate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { description: string }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipe/${recipeId}/direction/create/`,
  });
}

export function directionDestroy(
  send: ApiSendFunction,
  { directionId }: { directionId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/direction/${directionId}/destroy/`,
  });
}

export function directionGet(
  send: ApiSendFunction,
  { directionId }: { directionId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ direction: directionSchema }),
    url: `/api/direction/${directionId}/`,
  });
}

export function directionsReorder(
  send: ApiSendFunction,
  { data }: { data: { directions: { id: string; order: number }[] } }
) {
  return send({
    data,
    method: "POST",
    url: `/api/directions/reorder/`,
  });
}

export function directionUpdate(
  send: ApiSendFunction,
  {
    data,
    directionId,
  }: {
    data: { description: string };
    directionId: string;
  }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/direction/${directionId}/update/`,
  });
}

export function equipmentCreate(
  send: ApiSendFunction,
  { data }: { data: { description: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/equipment/create/`,
  });
}

export function equipmentDestroy(
  send: ApiSendFunction,
  { equipmentId }: { equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/equipment/${equipmentId}/destroy/`,
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
    url: `/api/equipment-many/${queryParam}`,
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
    url: `/api/recipe/${recipeId}/equipment/link/`,
  });
}

export function equipmentOneGet(
  send: ApiSendFunction,
  { equipmentId }: { equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ equipmentOne: equipmentSchema }),
    url: `/api/equipment-one/${equipmentId}/`,
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
    url: `/api/equipment/${params.equipmentId}/recipes/?page=${page}`,
  });
}

export function equipmentUnlink(
  send: ApiSendFunction,
  { recipeId, equipmentId }: { recipeId: string; equipmentId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${recipeId}/equipment/${equipmentId}/unlink/`,
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
    url: `/api/equipment/${equipmentId}/update/`,
  });
}

export function foodCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/food/create/`,
  });
}

export function foodDestroy(
  send: ApiSendFunction,
  { foodId }: { foodId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/food/${foodId}/destroy/`,
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
    url: `/api/food-many/${queryParam}`,
  });
}

export function foodOneGet(
  send: ApiSendFunction,
  { foodId }: { foodId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ foodOne: foodSchema }),
    url: `/api/food-one/${foodId}/`,
  });
}

export function foodRecipesGet(
  send: ApiSendFunction,
  params: { page?: number; foodId: string }
): Promise<ApiResponse> {
  const page = encodeURIComponent(params.page ?? 1);

  return send({
    method: "GET",
    responseDataSchema: z.object({
      pagination: paginationSchema,
      recipes: z.array(recipeSchema),
    }),
    url: `/api/food/${params.foodId}/recipes/?page=${page}`,
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
    url: `/api/food/${foodId}/update/`,
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
    url: `/api/recipe/${recipeId}/ingredient/create/`,
  });
}

export function ingredientDestroy(
  send: ApiSendFunction,
  { ingredientId }: { ingredientId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/ingredient/${ingredientId}/destroy/`,
  });
}

export function ingredientGet(
  send: ApiSendFunction,
  { ingredientId }: { ingredientId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ ingredient: ingredientSchema }),
    url: `/api/ingredient/${ingredientId}/`,
  });
}

export function ingredientsReorder(
  send: ApiSendFunction,
  { data }: { data: { ingredients: { id: string; order: number }[] } }
) {
  return send({
    data,
    method: "POST",
    url: `/api/ingredients/reorder/`,
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
    url: `/api/ingredient/${ingredientId}/update/`,
  });
}

export function login(
  send: ApiSendFunction,
  {
    data,
  }: { data: { password: string; remember_me: boolean; username: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/login/",
  });
}

export function logout(send: ApiSendFunction) {
  return send({
    method: "POST",
    url: "/api/logout/",
  });
}

export function notesDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${recipeId}/notes/destroy/`,
  });
}

export function notesUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { notes: string }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipe/${recipeId}/notes/update/`,
  });
}

export function ratingDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${recipeId}/rating/destroy/`,
  });
}

export function ratingGet(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ rating: z.object({ rating: z.number() }) }),
    url: `/api/rating/${recipeId}/`,
  });
}

export function ratingUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { rating: number }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/rating/${recipeId}/update/`,
  });
}

export function recipeCreate(
  send: ApiSendFunction,
  { data }: { data: { title: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/recipe/create/",
  });
}

export function recipeGet(
  send: ApiSendFunction,
  params: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ recipe: recipeSchema }),
    url: `/api/recipe/${params.recipeId}/`,
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
    url: `/api/recipes/?page=${page}`,
  });
}

export function recipeDestroy(
  send: ApiSendFunction,
  params: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${params.recipeId}/destroy/`,
  });
}

export function recipeTitleUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { title: string }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipe/${recipeId}/title/update/`,
  });
}

export function servingsDestroy(
  send: ApiSendFunction,
  { recipeId }: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${recipeId}/servings/destroy/`,
  });
}

export function servingsUpdate(
  send: ApiSendFunction,
  { data, recipeId }: { data: { servings: number }; recipeId: string }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/recipe/${recipeId}/servings/update/`,
  });
}

export function signupConfirmationUpdate(
  send: ApiSendFunction,
  { data }: { data: { token: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/signup_confirmation/update/",
  });
}

export function signupCreate(
  send: ApiSendFunction,
  { data }: { data: { email: string; password: string; username: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/signup/create/",
  });
}

export function tagCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/tag/create/`,
  });
}

export function tagDestroy(
  send: ApiSendFunction,
  { tagId }: { tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/tag/${tagId}/destroy/`,
  });
}

export function tagGet(
  send: ApiSendFunction,
  { tagId }: { tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ tag: tagSchema }),
    url: `/api/tag/${tagId}/`,
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
    url: `/api/recipe/${recipeId}/tag/link/`,
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
    url: `/api/tags/${queryParam}`,
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
    url: `/api/tag/${params.tagId}/recipes/?page=${page}`,
  });
}

export function tagUnlink(
  send: ApiSendFunction,
  { recipeId, tagId }: { recipeId: string; tagId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipe/${recipeId}/tag/${tagId}/unlink/`,
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
    url: `/api/tag/${tagId}/update/`,
  });
}

export function timeCategoryGet(
  send: ApiSendFunction,
  { timeCategoryId }: { timeCategoryId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ timeCategory: timeCategorySchema }),
    url: `/api/time-category/${timeCategoryId}/`,
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
    url: `/api/time-categories/${queryParam}`,
  });
}

export function timeCategoryCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/time-category/create/`,
  });
}

export function timeCategoryDestroy(
  send: ApiSendFunction,
  { timeCategoryId }: { timeCategoryId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/time-category/${timeCategoryId}/destroy/`,
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
    url: `/api/time-category/${timeCategoryId}/update/`,
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
    url: `/api/recipe/${recipeId}/time/create/`,
  });
}

export function timeDestroy(
  send: ApiSendFunction,
  { timeId }: { timeId: string }
) {
  return send({
    method: "POST",
    url: `/api/time/${timeId}/destroy/`,
  });
}

export function timeGet(
  send: ApiSendFunction,
  { recipeId, timeId }: { recipeId: string; timeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ time: timeSchema }),
    url: `/api/recipe/${recipeId}/time/${timeId}/`,
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
    url: `/api/recipe/${recipeId}/time/${timeId}/update/`,
  });
}

export function unitCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: `/api/unit/create/`,
  });
}

export function unitGet(
  send: ApiSendFunction,
  { unitId }: { unitId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ unit: unitSchema }),
    url: `/api/unit/${unitId}/`,
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
    url: `/api/units/${queryParam}`,
  });
}

export function unitDestroy(
  send: ApiSendFunction,
  { unitId }: { unitId: string }
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/unit/${unitId}/destroy/`,
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
    url: `/api/unit/${unitId}/update/`,
  });
}
