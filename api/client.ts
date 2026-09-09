const API_BASE_URL = "https://localhost:44314/api";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (typeof window !== "undefined" && !requestHeaders.has("Authorization")) {
    const token =
      window.localStorage.getItem("accessToken") ??
      window.localStorage.getItem("token");

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
    body:
      body && typeof body === "object" && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export { API_BASE_URL };
