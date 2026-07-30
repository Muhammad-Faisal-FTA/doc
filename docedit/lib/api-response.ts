import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wraps a route handler body so any thrown/unexpected error becomes a
 * clean JSON 500 instead of an unhandled exception that Next.js would
 * otherwise surface as an opaque failure (NFR-2).
 */
export async function withErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    console.error("[api] unhandled error:", err);
    return jsonError("Something went wrong on the server. Please try again.", 500);
  }
}
