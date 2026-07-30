"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api-client";
import { SEEDED_USERS } from "@/lib/users";
import type { SeededUser } from "@/types";

const STORAGE_KEY = "docedit:activeUserId";

type UserContextValue = {
  users: SeededUser[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<SeededUser[]>(SEEDED_USERS);
  const [activeUserId, setActiveUserIdState] = useState<string>(SEEDED_USERS[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SEEDED_USERS.some((u) => u.id === stored)) {
      // localStorage isn't available during SSR, so reading it after mount
      // is the standard client-hydration pattern, not an accidental
      // cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveUserIdState(stored);
    }
    api
      .listUsers()
      .then((fetched) => {
        if (fetched.length) setUsers(fetched);
      })
      .catch(() => {
        // Fall back silently to the local SEEDED_USERS constant — the
        // switcher still works even if the DB round-trip fails.
      })
      .finally(() => setLoading(false));
  }, []);

  function setActiveUserId(id: string) {
    setActiveUserIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <UserContext.Provider value={{ users, activeUserId, setActiveUserId, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useActiveUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useActiveUser must be used within UserProvider");
  return ctx;
}
