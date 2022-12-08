import { ApiResponse, ApiSendFunction } from "../lib/types";

export function createSignup(
  data: {
    email: string;
    password: string;
    username: string;
  },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/signup/",
  });
}

export function login(
  data: {
    password: string;
    remember_me: boolean;
    username: string;
  },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/login/",
  });
}

export function updateSignupConfirmation(
  data: {
    token: string;
  },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/signup_confirmation/",
  });
}
