import { ApiResponse, ApiSendFunction } from "../lib/types";

function createSignup({
  send,
  data,
}: {
  data: {
    email: string;
    password: string;
    username: string;
  };
  send: ApiSendFunction;
}): Promise<ApiResponse> {
  return send({
    data,
    method: "POST",
    url: "/api/accounts/signup/",
  });
}

export default { createSignup };
