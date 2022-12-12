import { ApiResponse, ApiSendFunction } from "../lib/types";

export function accountsDestroy(
  data: {
    password: string;
  },
  send: ApiSendFunction
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/destroy/",
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

export function logout(send: ApiSendFunction) {
  return send({
    method: "POST",
    url: "/api/accounts/logout/",
  });
}

export function signupConfirmationUpdate(
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

export function signupCreate(
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
