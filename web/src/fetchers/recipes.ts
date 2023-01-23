import {
  ApiResponse,
  ApiSendFunction,
  paginationSchema,
  recipeSchema,
  tagSchema,
} from "../lib/types";
import { z } from "zod";

export function recipeCreate(
  data: {
    title: string;
  },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    responseDataSchema: z.object({ id: z.number() }),
    url: "/api/recipes/recipe/create/",
  });
}

export function recipeGet(
  recipeId: string,
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: recipeSchema,
    url: `/api/recipes/recipe/${recipeId}/`,
  });
}

export function recipesGet(
  data: { page?: number },
  send: ApiSendFunction
): Promise<ApiResponse> {
  const page = encodeURIComponent(data.page ?? 1);

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
  args: { recipeId: string },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    method: "POST",
    url: `/api/recipes/recipe/${args.recipeId}/destroy/`,
  });
}

export function recipeTitleUpdate(
  args: { recipeId: string; data: { title: string } },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data: args.data,
    method: "POST",
    url: `/api/recipes/recipe/${args.recipeId}/title/update/`,
  });
}

export function tagAssociate(
  args: { recipeId: string; data: { name: string } },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data: args.data,
    method: "POST",
    responseDataSchema: tagSchema,
    url: `/api/recipes/recipe/${args.recipeId}/tag/associate/`,
  });
}

export function tagCreate(
  args: { name: string },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data: args,
    method: "POST",
    responseDataSchema: z.object({ id: z.number() }),
    url: `/api/recipes/tag/create/`,
  });
}

export function tagDissociate(
  args: { recipeId: string; tagId: string },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data: args,
    method: "POST",
    url: `/api/recipes/recipe/${args.recipeId}/tag/${args.tagId}/dissociate/`,
  });
}

export function tagsGet(send: ApiSendFunction): Promise<ApiResponse> {
  return send({
    method: "GET",
    responseDataSchema: z.object({ tags: z.array(tagSchema) }),
    url: `/api/recipes/tags/`,
  });
}
