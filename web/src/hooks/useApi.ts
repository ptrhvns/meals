import Cookies from "js-cookie";
import useAuthn from "./useAuthn";
import {
  accountDestroy,
  login,
  logout,
  signupConfirmationUpdate,
  signupCreate,
} from "../fetchers/accounts";
import {
  AnyFunction,
  ApiResponse,
  ApiSendParameter,
  Optional,
  SecondParameter,
} from "../lib/types";
import { isEmpty, omit } from "lodash";
import {
  brandCreate,
  brandDestroy,
  brandGet,
  brandsGet,
  brandUpdate,
  equipmentCreate,
  equipmentDestroy,
  equipmentLink,
  equipmentManyGet,
  equipmentOneGet,
  equipmentRecipesGet,
  equipmentUnlink,
  equipmentUpdate,
  foodCreate,
  foodManyGet,
  ingredientCreate,
  ingredientDestroy,
  ingredientGet,
  ingredientUpdate,
  notesDestroy,
  notesUpdate,
  ratingDestroy,
  ratingGet,
  ratingUpdate,
  recipeCreate,
  recipeDestroy,
  recipeGet,
  recipesGet,
  recipeTitleUpdate,
  servingsDestroy,
  servingsUpdate,
  tagCreate,
  tagDestroy,
  tagGet,
  tagLink,
  tagRecipesGet,
  tagsGet,
  tagUnlink,
  tagUpdate,
  timeCategoriesGet,
  timeCreate,
  timeDestroy,
  timeGet,
  timeUpdate,
  unitsGet,
} from "../fetchers/recipes";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const DEFAULT_HEADERS_INIT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const SAFE_METHODS = ["GET"];

async function getJson(res: Response): Promise<object> {
  const text = await res.text();
  return isEmpty(text) ? {} : await JSON.parse(text);
}

// Ensure this matches ApiResponse type.
const apiResponseSchema = z.object({
  data: z.optional(z.any()),
  errors: z.optional(z.record(z.string(), z.array(z.string()))),
  isError: z.optional(z.boolean()),
  message: z.optional(z.string()),
});

export default function useApi() {
  const navigate = useNavigate();
  const { logout: logoutAuthn } = useAuthn();

  const send = useCallback(
    async ({
      data,
      headers_init,
      method,
      responseDataSchema,
      url,
    }: ApiSendParameter): Promise<ApiResponse> => {
      let body: Optional<string>;

      try {
        body = data ? JSON.stringify(data) : null;
      } catch (error) {
        return {
          isError: true,
          message: "Your request could not be properly formatted.",
        };
      }

      const headers = new Headers({
        ...DEFAULT_HEADERS_INIT,
        ...headers_init,
      });

      const mode = "same-origin";

      let response: Response;

      if (!SAFE_METHODS.includes(method)) {
        try {
          response = await fetch("/api/shared/csrf_token/", {
            headers,
            method: "GET",
            mode,
          });
        } catch (error) {
          console.error("GET CSRF token caused a network error", error);

          return {
            isError: true,
            message: "An unexpected error occurred.",
          };
        }

        if (!response.ok) {
          console.error("GET CSRF token response status was not OK", response);

          return {
            isError: true,
            message: "An unexpected error occurred.",
          };
        }

        const csrfToken = Cookies.get("csrftoken");

        if (!csrfToken) {
          console.error("CSRF token cookie was not found");

          return {
            isError: true,
            message: "An unexpected error occurred.",
          };
        }

        headers.append("X-CSRFToken", csrfToken);
      }

      try {
        response = await fetch(url, { body, headers, method, mode });
      } catch (error) {
        console.error(`${method} ${url} caused a network error`, error);

        return {
          isError: true,
          message: "Your request could not be sent due to a network error.",
        };
      }

      if (
        !response.ok &&
        (response.status === 401 || response.status === 403)
      ) {
        console.error(`${method} ${url} was unauthorized (401 | 403)`);
        logoutAuthn(() => navigate("/login"));

        // This return is really only here to satisfy TypeScript.
        return {
          isError: true,
          message: "Your request was not authorized.",
        };
      }

      let json: ApiResponse = {};

      if (!response.ok) {
        try {
          json = await getJson(response);
        } catch (error) {
          json = {};
        }

        console.error(`${method} ${url} response status was not OK`, response);

        return {
          isError: true,
          message: json?.message ?? "An unexpected error occurred.",
          ...omit(json, "message"),
        };
      }

      try {
        json = await getJson(response);
      } catch (error) {
        console.error(
          `${method} ${url} response contained invalid JSON`,
          error
        );

        return {
          isError: true,
          message: "An unexpected error occurred.",
        };
      }

      let computedSchema: z.AnyZodObject = apiResponseSchema;

      if (responseDataSchema) {
        computedSchema = apiResponseSchema.merge(
          z.object({ data: responseDataSchema })
        );
      }

      if (!(await computedSchema.spa(json))) {
        console.error(`${method} ${url} response JSON failed validation`, json);

        return {
          isError: true,
          message: "An unexpected error occurred.",
        };
      }

      return json;
    },
    [logoutAuthn, navigate]
  );

  // XXX What's better than using the following `with*()` focutions to create a
  // closure around `send()`, and to ensure that the caller can reference the
  // other arguments easily?
  function withSend<F extends AnyFunction>(fn: F) {
    return (): ReturnType<F> => fn(send);
  }

  function withSendAndArgs<F extends AnyFunction>(fn: F) {
    return (args: SecondParameter<F>): ReturnType<F> => fn(send, args);
  }

  function withSendAndOptionalArgs<F extends AnyFunction>(fn: F) {
    return (args?: SecondParameter<F>): ReturnType<F> => fn(send, args);
  }

  return {
    accountDestroy: withSendAndArgs(accountDestroy),
    brandCreate: withSendAndArgs(brandCreate),
    brandDestroy: withSendAndArgs(brandDestroy),
    brandGet: withSendAndArgs(brandGet),
    brandsGet: withSendAndOptionalArgs(brandsGet),
    brandUpdate: withSendAndArgs(brandUpdate),
    equipmentCreate: withSendAndArgs(equipmentCreate),
    equipmentDestroy: withSendAndArgs(equipmentDestroy),
    equipmentLink: withSendAndArgs(equipmentLink),
    equipmentManyGet: withSendAndOptionalArgs(equipmentManyGet),
    equipmentOneGet: withSendAndArgs(equipmentOneGet),
    equipmentRecipesGet: withSendAndArgs(equipmentRecipesGet),
    equipmentUnlink: withSendAndArgs(equipmentUnlink),
    equipmentUpdate: withSendAndArgs(equipmentUpdate),
    foodCreate: withSendAndArgs(foodCreate),
    foodManyGet: withSendAndOptionalArgs(foodManyGet),
    ingredientCreate: withSendAndArgs(ingredientCreate),
    ingredientDestroy: withSendAndArgs(ingredientDestroy),
    ingredientGet: withSendAndArgs(ingredientGet),
    ingredientUpdate: withSendAndArgs(ingredientUpdate),
    login: withSendAndArgs(login),
    logout: withSend(logout),
    notesDestroy: withSendAndArgs(notesDestroy),
    notesUpdate: withSendAndArgs(notesUpdate),
    ratingDestroy: withSendAndArgs(ratingDestroy),
    ratingGet: withSendAndArgs(ratingGet),
    ratingUpdate: withSendAndArgs(ratingUpdate),
    recipeCreate: withSendAndArgs(recipeCreate),
    recipeDestroy: withSendAndArgs(recipeDestroy),
    recipeGet: withSendAndArgs(recipeGet),
    recipesGet: withSendAndArgs(recipesGet),
    recipeTitleUpdate: withSendAndArgs(recipeTitleUpdate),
    servingsDestroy: withSendAndArgs(servingsDestroy),
    servingsUpdate: withSendAndArgs(servingsUpdate),
    signupConfirmationUpdate: withSendAndArgs(signupConfirmationUpdate),
    signupCreate: withSendAndArgs(signupCreate),
    tagCreate: withSendAndArgs(tagCreate),
    tagDestroy: withSendAndArgs(tagDestroy),
    tagGet: withSendAndArgs(tagGet),
    tagLink: withSendAndArgs(tagLink),
    tagRecipesGet: withSendAndArgs(tagRecipesGet),
    tagsGet: withSendAndOptionalArgs(tagsGet),
    tagUnlink: withSendAndArgs(tagUnlink),
    tagUpdate: withSendAndArgs(tagUpdate),
    timeCategoriesGet: withSend(timeCategoriesGet),
    timeCreate: withSendAndArgs(timeCreate),
    timeDestroy: withSendAndArgs(timeDestroy),
    timeGet: withSendAndArgs(timeGet),
    timeUpdate: withSendAndArgs(timeUpdate),
    unitsGet: withSend(unitsGet),
  };
}
