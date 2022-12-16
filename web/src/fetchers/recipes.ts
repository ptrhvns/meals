import { ApiResponse, ApiSendFunction } from "../lib/types";
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
    url: "/api/recipes/recipe/create",
  });
}

export function recipeGet(
  recipeId: string,
  send: ApiSendFunction
): Promise<ApiResponse> {
  // Ensure this matches RecipeData type.
  const responseDataSchema = z.object({ id: z.number(), title: z.string() });

  return send({
    method: "GET",
    responseDataSchema,
    url: `/api/recipes/recipe/${recipeId}`,
  });
}
