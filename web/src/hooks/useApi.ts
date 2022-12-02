// import { useNavigate } from "react-router-dom"; // TODO
import Cookies from "js-cookie";
import signupFetchers from "../fetchers/signup";
import {
  AnyFunction,
  ApiResponse,
  ApiSendFunction,
  ApiSendParameter,
  FirstParameter,
} from "../lib/types";
import { fromPairs, isEmpty, omit, toPairs } from "lodash";
import { useCallback } from "react";
import { z } from "zod";

const FETCHERS = {
  ...signupFetchers,
};

const DEFAULT_HEADERS_INIT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const SAFE_METHODS = ["GET"];

const wrapFetcher =
  <SendFunction extends ApiSendFunction, FetchFunction extends AnyFunction>(
    send: SendFunction,
    fn: FirstParameter<FetchFunction> extends { send: SendFunction }
      ? FetchFunction
      : never
  ) =>
  ({
    ...rest
  }: Omit<FirstParameter<FetchFunction>, "send"> extends infer O
    ? { [K in keyof O]: O[K] }
    : never): Promise<ApiResponse> =>
    fn({ send, ...rest });

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
        console.error("Request data could not be properly formatted:", error);

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
          console.error("CSRF token could not be obtained:", error);

          return {
            isError: true,
            message: "Your request could not be sent.",
          };
        }

        if (!response.ok) {
          console.error("CSRF token could not be obtained:", response);

          return {
            isError: true,
            message: "Your request could not be sent.",
          };
        }

        const csrfToken = Cookies.get("csrftoken");

        if (!csrfToken) {
          console.error("CSRF token cookie was not found");

          return {
            isError: true,
            message: "Your request could not be sent.",
          };
        }

        headers.append("X-CSRFToken", csrfToken);
      }

      try {
        response = await fetch(url, { body, headers, method, mode });
      } catch (error) {
        console.error("Request could not be sent:", error);

        return {
          isError: true,
          message: "Your request could not be sent.",
        };
      }

      if (
        !response.ok &&
        (response.status === 401 || response.status === 403)
      ) {
        // logout(() => navigate(WEB_ROUTES.login())); // TODO
        console.error("Request was unauthorized:", response);

        return {
          isError: true,
          message: "Your request was not authorized. Try logging in.",
        };
      }

      let json: ApiResponse = {};

      if (!response.ok) {
        console.error("Response was an error:", response);

        try {
          json = await getJson(response);
        } catch (error) {
          console.error("Response JSON was invalid:", error);
          json = {};
        }

        return {
          isError: true,
          message:
            json?.message ?? "The response to your request was an error.",
          ...omit(json, "message"),
        };
      }

      try {
        json = await getJson(response);
      } catch (error) {
        console.error("Response JSON was invalid:", error);

        return {
          isError: true,
          message: "The response to your request was in an invalid format.",
        };
      }

      const computedSchema = apiResponseSchema.merge(
        responseDataSchema ?? z.object({})
      );

      if (!(await computedSchema.spa(json))) {
        console.error("Response JSON contained invalid information:", json);

        return {
          isError: true,
          message:
            "The response to your request contained invalid information.",
        };
      }

      return json;
    },
    [
      /* TODO logout, */
      /* TODO navigate */
    ]
  );

  // Wrap fetcher functions to pass in this send function.
  return fromPairs(
    toPairs(FETCHERS).map(([fnName, fn]) => [fnName, wrapFetcher(send, fn)])
  );
}
