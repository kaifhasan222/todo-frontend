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

type AuthMode = "required" | "none";

interface RequestJsonOptions extends RequestInit {
  auth?: AuthMode;
  _retryAfterRefresh?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const REFRESH_ENDPOINT = `${API_BASE_URL}/api/auth/refresh`;

let refreshRequest: Promise<string> | null = null;

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

const buildHeaders = (headers: HeadersInit | undefined, accessToken: string | null) => {
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return nextHeaders;
};

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      const response = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new ApiRequestError("Session expired. Please sign in again.", response.status);
      }

      const body = await readResponseBody<RefreshResponse>(response);

      if (!body?.accessToken) {
        throw new ApiRequestError("Missing access token from refresh response.", 500);
      }

      useAuthSessionStore.getState().setAccessToken(body.accessToken);
      return body.accessToken;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
};

export const requestJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestJsonOptions,
): Promise<T> => {
  const { auth = "none", _retryAfterRefresh = false, ...requestInit } = init ?? {};
  const accessToken = auth === "required"
    ? useAuthSessionStore.getState().accessToken
    : null;

  const response = await fetch(input, {
    credentials: "include",
    ...requestInit,
    headers: buildHeaders(requestInit.headers, accessToken),
  });

  if (response.ok) {
    const body = await readResponseBody<T>(response);
    return body as T;
  }

  const body = await readResponseBody<ErrorPayload>(response);

  if (response.status === 401 && auth === "required" && !_retryAfterRefresh) {
    try {
      await refreshAccessToken();

      return requestJson<T>(input, {
        ...requestInit,
        auth,
        _retryAfterRefresh: true,
      });
    } catch {
      useAuthSessionStore.getState().setUnauthenticated();
      throw new ApiRequestError(
        body?.message ?? "Session expired. Please sign in again.",
        response.status,
      );
    }
  }

  if (response.status === 401) {
    useAuthSessionStore.getState().setUnauthenticated();
  }

  throw new ApiRequestError(
    body?.message ?? "Request failed. Please try again.",
    response.status,
  );
};
