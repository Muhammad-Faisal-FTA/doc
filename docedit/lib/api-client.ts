import type { DocumentDTO, SeededUser } from "@/types";

async function parseOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body as T;
}

function authHeaders(userId: string): HeadersInit {
  return { "x-user-id": userId, "Content-Type": "application/json" };
}

export const api = {
  async listUsers(): Promise<SeededUser[]> {
    const res = await fetch("/api/users");
    const body = await parseOrThrow<{ users: SeededUser[] }>(res);
    return body.users;
  },

  async listDocuments(userId: string): Promise<DocumentDTO[]> {
    const res = await fetch(`/api/documents?userId=${encodeURIComponent(userId)}`);
    const body = await parseOrThrow<{ documents: DocumentDTO[] }>(res);
    return body.documents;
  },

  async createDocument(userId: string, title?: string): Promise<DocumentDTO> {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: authHeaders(userId),
      body: JSON.stringify(title ? { title } : {}),
    });
    const body = await parseOrThrow<{ document: DocumentDTO }>(res);
    return body.document;
  },

  async getDocument(userId: string, id: string): Promise<DocumentDTO> {
    const res = await fetch(`/api/documents/${id}`, { headers: authHeaders(userId) });
    const body = await parseOrThrow<{ document: DocumentDTO }>(res);
    return body.document;
  },

  async updateDocument(
    userId: string,
    id: string,
    updates: { title?: string; content?: string }
  ): Promise<DocumentDTO> {
    const res = await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: authHeaders(userId),
      body: JSON.stringify(updates),
    });
    const body = await parseOrThrow<{ document: DocumentDTO }>(res);
    return body.document;
  },

  async deleteDocument(userId: string, id: string): Promise<void> {
    const res = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      headers: authHeaders(userId),
    });
    await parseOrThrow<{ ok: true }>(res);
  },

  async shareDocument(userId: string, id: string, targetUserId: string): Promise<DocumentDTO> {
    const res = await fetch(`/api/documents/${id}/share`, {
      method: "POST",
      headers: authHeaders(userId),
      body: JSON.stringify({ targetUserId }),
    });
    const body = await parseOrThrow<{ document: DocumentDTO }>(res);
    return body.document;
  },

  async uploadFile(userId: string, file: File): Promise<DocumentDTO> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-user-id": userId },
      body: formData,
    });
    const body = await parseOrThrow<{ document: DocumentDTO }>(res);
    return body.document;
  },
};
