import Cookies from "js-cookie";
import {
  AnyFunction,
  ApiResponse,
  ApiSendParameter,
  FirstParameter,
} from "../lib/types";
import {
  accountsDestroy,
  createSignup,
  login,
  logout,
  updateSignupConfirmation,
} from "../fetchers/accounts";
import { isEmpty, omit } from "lodash";
import { useCallback } from "react";
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

const apiResponseSchema = z.object({
  data: z.optional(z.any()),
  errors: z.optional(z.record(z.string(), z.array(z.string()))),
  isError: z.optional(z.boolean()),
  message: z.optional(z.string()),
});

export default function useApi() {
  // const navigate = useNavigate(); // TODO
  // const { logout } = useAuthn(); // TODO

  const send = useCallback(
    async ({
      data,
      headers_init,
      method,
      responseDataSchema,
      url,
    }: ApiSendParameter): Promise<ApiResponse> => {
      let body: string | null;

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
          console.error("GET CSRF token response was not OK", response);

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
        // logout(() => navigate(WEB_ROUTES.login()));

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
          console.error(
            `${method} ${url} response contained invalid JSON`,
            error
          );
          json = {};
        }

        console.error(`${method} ${url} response was not OK`, response);

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

      const computedSchema = apiResponseSchema.merge(
        responseDataSchema ?? z.object({})
      );

      if (!(await computedSchema.spa(json))) {
        console.error(`${method} ${url} response JSON failed validation`, json);

        return {
          isError: true,
          message: "An unexpected error occurred.",
        };
      }

      return json;
    },
    [
      /* TODO logout, */
      /* TODO navigate */
    ]
  );

  function wrapWithoutData<F extends AnyFunction>(fn: F) {
    return (): ReturnType<F> => fn(send);
  }

  function wrapWithData<F extends AnyFunction>(fn: F) {
    return (data: FirstParameter<F>): ReturnType<F> => fn(data, send);
  }

  return {
    accountsDestroy: wrapWithData(accountsDestroy),
    createSignup: wrapWithData(createSignup),
    login: wrapWithData(login),
    logout: wrapWithoutData(logout),
    updateSignupConfirmation: wrapWithData(updateSignupConfirmation),
  };
}
