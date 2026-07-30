"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useActiveUser } from "@/app/providers/UserProvider";

export default function UploadWidget() {
  const { activeUserId } = useActiveUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const doc = await api.uploadFile(activeUserId, file);
      router.push(`/document/${doc._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
        {uploading ? "Uploading..." : "Upload .txt / .md"}
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-400">Only .txt and .md files are supported.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
