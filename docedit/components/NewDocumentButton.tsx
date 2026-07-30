"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useActiveUser } from "@/app/providers/UserProvider";

export default function NewDocumentButton() {
  const { activeUserId } = useActiveUser();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setCreating(true);
    setError(null);
    try {
      const doc = await api.createDocument(activeUserId);
      router.push(`/document/${doc._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create document.");
      setCreating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={creating}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {creating ? "Creating..." : "+ New document"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
