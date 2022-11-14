export type Optional<T> = T | undefined | null;

export interface ApiResponse {
  data?: any;
  errors?: { [key: string]: string[] };
  isError?: boolean;
  message?: string;
}

export interface ApiSendParameter {
  data?: object;
  headers_init?: object;
  method: "GET" | "POST";
  url: string;
}

export type ApiSendFunction = (param: ApiSendParameter) => Promise<ApiResponse>;
