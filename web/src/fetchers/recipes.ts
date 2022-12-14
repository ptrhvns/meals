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
