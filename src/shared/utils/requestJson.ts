import { useAuthSessionStore } from "@/shared/store/useAuthSessionStore";

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

interface ErrorPayload {
  message?: string;
}

const readResponseBody = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export const requestJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (response.ok) {
    const body = await readResponseBody<T>(response);
    return body as T;
  }

  const body = await readResponseBody<ErrorPayload>(response);

  if (response.status === 401) {
    useAuthSessionStore.getState().setUnauthenticated();
  }

  throw new ApiRequestError(
    body?.message ?? "Request failed. Please try again.",
    response.status,
  );
};
