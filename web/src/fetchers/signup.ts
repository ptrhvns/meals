import { ApiResponse, ApiSendFunction } from "../lib/types";

async function createSignup({
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
    url: "/api/signup/",
  });
}

export default { createSignup };
