const API_BASE_URL = "http://localhost:5259/api";

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

  // Đọc text trước rồi tự parse, để chịu được cả JSON lẫn chuỗi thường
  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export { API_BASE_URL };
