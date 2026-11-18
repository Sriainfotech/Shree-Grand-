/**
 * Backend API base URL. Set VITE_API_URL in .env.local (dev) or your
 * deployment's environment variables (production) — see .env.example.
 * Falls back to same-origin ("") so a same-domain deployment (API behind
 * a reverse proxy on the same host) works with no env var at all.
 */
export const API_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "") ?? "";

export type ApiResponse<T> =
  | { success: true; message: string; data: T; meta?: unknown }
  | { success: false; message: string; errors?: { field: string; message: string }[] };

export class ApiRequestError extends Error {
  status: number;
  fieldErrors: { field: string; message: string }[] | undefined;

  constructor(status: number, message: string, fieldErrors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Shared response-envelope handling for apiGet/apiPost. */
async function unwrap<T>(res: Response): Promise<T> {
  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiRequestError(res.status, "The server returned an unexpected response.");
  }

  if (!res.ok || !json.success) {
    const message = json.success
      ? "Something went wrong. Please try again."
      : json.message || "Something went wrong. Please try again.";
    throw new ApiRequestError(res.status, message, json.success ? undefined : json.errors);
  }

  return json.data;
}

/** Thin fetch wrapper matching the backend's { success, message, data }
 * envelope — throws ApiRequestError with the backend's own message on any
 * non-2xx response, including field-level validation errors. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<T>(res);
}

/** Same envelope handling as apiPost, for GET requests. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return unwrap<T>(res);
}
