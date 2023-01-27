import {
  ApiResponse,
  ApiSendFunction,
  paginationSchema,
  recipeSchema,
  tagSchema,
} from "../lib/types";
import { z } from "zod";

export function recipeCreate(
  send: ApiSendFunction,
  { data }: { data: { title: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    responseDataSchema: z.object({ id: z.number() }),
    url: "/api/recipes/recipe/create/",
  });
}

export function recipeGet(
  send: ApiSendFunction,
  params: { recipeId: string }
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: recipeSchema,
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

export function tagCreate(
  send: ApiSendFunction,
  { data }: { data: { name: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    responseDataSchema: z.object({ id: z.number() }),
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
    responseDataSchema: tagSchema,
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
    responseDataSchema: tagSchema,
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
