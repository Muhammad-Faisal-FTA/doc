"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { useActiveUser } from "@/app/providers/UserProvider";
import type { DocumentDTO } from "@/types";

export default function ShareModal({
  doc,
  onClose,
  onShared,
}: {
  doc: DocumentDTO;
  onClose: () => void;
  onShared: (updated: DocumentDTO) => void;
}) {
  const { activeUserId, users } = useActiveUser();
  const [error, setError] = useState<string | null>(null);
  const [sharingWith, setSharingWith] = useState<string | null>(null);

  const candidates = users.filter((u) => u.id !== doc.ownerId);

  async function handleShare(targetUserId: string) {
    setError(null);
    setSharingWith(targetUserId);
    try {
      const updated = await api.shareDocument(activeUserId, doc._id, targetUserId);
      onShared(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not share document.");
    } finally {
      setSharingWith(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Share &ldquo;{doc.title}&rdquo;</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mb-3 text-xs text-gray-500">
          Shared users get read-only access — they can&apos;t edit or delete this document.
        </p>

        <ul className="flex flex-col gap-2">
          {candidates.map((u) => {
            const already = doc.sharedWith.includes(u.id);
            return (
              <li key={u.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                <span className="text-sm text-gray-800">{u.name}</span>
                <button
                  onClick={() => handleShare(u.id)}
                  disabled={already || sharingWith === u.id}
                  className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {already ? "Shared" : sharingWith === u.id ? "Sharing..." : "Share"}
                </button>
              </li>
            );
          })}
        </ul>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md border border-gray-300 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Done
        </button>
      </div>
    </div>
  );
}
