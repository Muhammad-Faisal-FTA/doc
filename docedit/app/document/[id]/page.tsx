"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DocEditor from "@/components/Editor";
import ShareModal from "@/components/ShareModal";
import UserSwitcher from "@/components/UserSwitcher";
import { api } from "@/lib/api-client";
import { useActiveUser } from "@/app/providers/UserProvider";
import type { DocumentDTO } from "@/types";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { activeUserId } = useActiveUser();

  const [doc, setDoc] = useState<DocumentDTO | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [shareOpen, setShareOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<string>("");

  useEffect(() => {
    // Reset to a loading state before refetching for the new id/user.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoc(null);
    setLoadError(null);
    api
      .getDocument(activeUserId, id)
      .then((d) => {
        setDoc(d);
        setTitle(d.title);
        latestContent.current = d.content;
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load document."));
  }, [activeUserId, id]);

  const isOwner = doc?.ownerId === activeUserId;

  const scheduleSave = useCallback(
    (updates: { title?: string; content?: string }) => {
      if (!isOwner) return;
      setSaveState("saving");
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        try {
          const updated = await api.updateDocument(activeUserId, id, updates);
          setDoc(updated);
          setSaveState("saved");
        } catch {
          setSaveState("error");
        }
      }, 600);
    },
    [activeUserId, id, isOwner]
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleSave({ title: value });
  }

  function handleContentChange(html: string) {
    latestContent.current = html;
    scheduleSave({ content: html });
  }

  async function handleDelete() {
    if (!doc) return;
    if (!confirm(`Delete "${doc.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await api.deleteDocument(activeUserId, doc._id);
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete document.");
      setDeleting(false);
    }
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to documents
        </Link>
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </div>
      </main>
    );
  }

  if (!doc) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-gray-400">Loading document...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to documents
        </Link>
        <UserSwitcher />
      </div>

      <div className="mb-2 flex items-center gap-2">
        {isOwner ? (
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-md border border-transparent px-1 text-xl font-semibold text-gray-900 hover:border-gray-200 focus:border-gray-300 focus:outline-none"
          />
        ) : (
          <h1 className="px-1 text-xl font-semibold text-gray-900">{doc.title}</h1>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!isOwner && (
          <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            Shared by {doc.ownerName} · read-only
          </span>
        )}
        {isOwner && (
          <>
            <span className="text-xs text-gray-400">
              {saveState === "saving" && "Saving..."}
              {saveState === "saved" && "Saved"}
              {saveState === "error" && <span className="text-red-600">Failed to save</span>}
            </span>
            <button
              onClick={() => setShareOpen(true)}
              className="ml-auto rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Share
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>

      <DocEditor content={doc.content} editable={isOwner} onChange={handleContentChange} />

      {shareOpen && (
        <ShareModal
          doc={doc}
          onClose={() => setShareOpen(false)}
          onShared={(updated) => setDoc(updated)}
        />
      )}
    </main>
  );
}
