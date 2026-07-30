import { NextResponse } from "next/server";
import { ensureUsersSeeded } from "@/lib/db-helpers";
import { SEEDED_USERS } from "@/lib/users";
import { withErrorHandling } from "@/lib/api-response";

export async function GET() {
  return withErrorHandling(async () => {
    await ensureUsersSeeded();
    return NextResponse.json({ users: SEEDED_USERS });
  });
}
