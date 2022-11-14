// import { useNavigate } from "react-router-dom"; // TODO
import Cookies from "js-cookie";
import signupFetchers from "../fetchers/signup";
import { ApiResponse, ApiSendFunction, ApiSendParameter } from "../lib/types";
import { fromPairs, isEmpty, omit, toPairs } from "lodash";
import { useCallback } from "react";

const FETCHERS = {
  ...signupFetchers,
};

const DEFAULT_HEADERS_INIT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const SAFE_METHODS = ["GET"];

type AnyFunction = (...args: any[]) => any;
type FirstParameter<F extends AnyFunction> = Parameters<F>[0];
type FetchReturn = Promise<ApiResponse>;

// TODO how can we ensure that `fn` takes an object paramter which has an
// appropriate `send` propery in it?
const wrapFetcher =
  <F extends (param: FirstParameter<F>) => FetchReturn>(
    send: ApiSendFunction,
    fn: F
  ): ((param: Omit<FirstParameter<F>, "send">) => FetchReturn) =>
  ({ ...rest }) =>
    fn({ send, ...rest });

async function getJson(res: Response): Promise<object> {
  const text = await res.text();
  return isEmpty(text) ? {} : await JSON.parse(text);
}

export default function useApi() {
  // const navigate = useNavigate(); // TODO
  // const { logout } = useAuthn(); // TODO

  const send = useCallback(
    async ({
      data,
      headers_init,
      method,
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
          response = await fetch("/api/csrf_token/", {
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

      let json: { message?: string } = {};

      if (!response.ok) {
        try {
          json = await getJson(response);
        } catch (error) {
          json = {};
        }

        console.error("Response was an error:", response);

        return {
          isError: true,
          message: json.message ?? "The response to your request was an error.",
          ...omit(json, "message"),
        };
      }

      try {
        json = await getJson(response);
      } catch (error) {
        console.error("Response was in an invalid format:", error);

        return {
          isError: true,
          message: "The response to your request was in an invalid format.",
        };
      }

      return json || {};
    },
    [
      /* TODO logout, */
      /* TODO navigate */
    ]
  );

  return fromPairs(
    toPairs(FETCHERS).map(([fnName, fn]) => [fnName, wrapFetcher(send, fn)])
  );
}
