"use client";

import { useActiveUser } from "@/app/providers/UserProvider";

export default function UserSwitcher() {
  const { users, activeUserId, setActiveUserId } = useActiveUser();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Viewing as
      <select
        value={activeUserId}
        onChange={(e) => setActiveUserId(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-900"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </label>
  );
}
