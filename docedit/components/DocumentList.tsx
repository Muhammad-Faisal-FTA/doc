"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useActiveUser } from "@/app/providers/UserProvider";
import type { DocumentDTO } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DocumentList() {
  const { activeUserId } = useActiveUser();
  const [docs, setDocs] = useState<DocumentDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    api
      .listDocuments(activeUserId)
      .then(setDocs)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load documents."));
  }, [activeUserId]);

  useEffect(() => {
    // Intentional reset to a loading state before refetching for the
    // newly active user.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDocs(null);
    load();
  }, [load]);

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (docs === null) {
    return <p className="text-sm text-gray-400">Loading documents...</p>;
  }

  if (docs.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        No documents yet. Create one or upload a .txt/.md file to get started.
      </p>
    );
  }

  const owned = docs.filter((d) => d.ownerId === activeUserId);
  const shared = docs.filter((d) => d.ownerId !== activeUserId);

  return (
    <div className="flex flex-col gap-6">
      {owned.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Your documents
          </h2>
          <ul className="flex flex-col gap-2">
            {owned.map((doc) => (
              <li key={doc._id}>
                <Link
                  href={`/document/${doc._id}`}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="font-medium text-gray-900">{doc.title}</span>
                  <span className="text-xs text-gray-400">Updated {formatDate(doc.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {shared.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Shared with you
          </h2>
          <ul className="flex flex-col gap-2">
            {shared.map((doc) => (
              <li key={doc._id}>
                <Link
                  href={`/document/${doc._id}`}
                  className="flex items-center justify-between rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{doc.title}</span>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      Shared by {doc.ownerName}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">Updated {formatDate(doc.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
