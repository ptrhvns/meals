import { ApiResponse, ApiSendFunction } from "../lib/types";

export function accountDestroy(
  send: ApiSendFunction,
  { data }: { data: { password: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/account/destroy/",
  });
}

export function login(
  send: ApiSendFunction,
  {
    data,
  }: { data: { password: string; remember_me: boolean; username: string } }
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
  send: ApiSendFunction,
  { data }: { data: { token: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/signup_confirmation/update/",
  });
}

export function signupCreate(
  send: ApiSendFunction,
  { data }: { data: { email: string; password: string; username: string } }
): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/signup/create/",
  });
}
