(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
async function parseOrThrow(res) {
    const body = await res.json().catch(()=>({}));
    if (!res.ok) {
        throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return body;
}
function authHeaders(userId) {
    return {
        "x-user-id": userId,
        "Content-Type": "application/json"
    };
}
const api = {
    async listUsers () {
        const res = await fetch("/api/users");
        const body = await parseOrThrow(res);
        return body.users;
    },
    async listDocuments (userId) {
        const res = await fetch(`/api/documents?userId=${encodeURIComponent(userId)}`);
        const body = await parseOrThrow(res);
        return body.documents;
    },
    async createDocument (userId, title) {
        const res = await fetch("/api/documents", {
            method: "POST",
            headers: authHeaders(userId),
            body: JSON.stringify(title ? {
                title
            } : {})
        });
        const body = await parseOrThrow(res);
        return body.document;
    },
    async getDocument (userId, id) {
        const res = await fetch(`/api/documents/${id}`, {
            headers: authHeaders(userId)
        });
        const body = await parseOrThrow(res);
        return body.document;
    },
    async updateDocument (userId, id, updates) {
        const res = await fetch(`/api/documents/${id}`, {
            method: "PATCH",
            headers: authHeaders(userId),
            body: JSON.stringify(updates)
        });
        const body = await parseOrThrow(res);
        return body.document;
    },
    async deleteDocument (userId, id) {
        const res = await fetch(`/api/documents/${id}`, {
            method: "DELETE",
            headers: authHeaders(userId)
        });
        await parseOrThrow(res);
    },
    async shareDocument (userId, id, targetUserId) {
        const res = await fetch(`/api/documents/${id}/share`, {
            method: "POST",
            headers: authHeaders(userId),
            body: JSON.stringify({
                targetUserId
            })
        });
        const body = await parseOrThrow(res);
        return body.document;
    },
    async uploadFile (userId, file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
                "x-user-id": userId
            },
            body: formData
        });
        const body = await parseOrThrow(res);
        return body.document;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEEDED_USERS",
    ()=>SEEDED_USERS,
    "getUserName",
    ()=>getUserName,
    "isValidUserId",
    ()=>isValidUserId
]);
const SEEDED_USERS = [
    {
        id: "user-alice",
        name: "Alice"
    },
    {
        id: "user-bob",
        name: "Bob"
    },
    {
        id: "user-carol",
        name: "Carol"
    }
];
function isValidUserId(id) {
    if (!id) return false;
    return SEEDED_USERS.some((u)=>u.id === id);
}
function getUserName(id) {
    return SEEDED_USERS.find((u)=>u.id === id)?.name ?? "Unknown user";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers/UserProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProvider",
    ()=>UserProvider,
    "useActiveUser",
    ()=>useActiveUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const STORAGE_KEY = "docedit:activeUserId";
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function UserProvider({ children }) {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEEDED_USERS"]);
    const [activeUserId, setActiveUserIdState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEEDED_USERS"][0].id);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProvider.useEffect": ()=>{
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEEDED_USERS"].some({
                "UserProvider.useEffect": (u)=>u.id === stored
            }["UserProvider.useEffect"])) {
                // localStorage isn't available during SSR, so reading it after mount
                // is the standard client-hydration pattern, not an accidental
                // cascading render.
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setActiveUserIdState(stored);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].listUsers().then({
                "UserProvider.useEffect": (fetched)=>{
                    if (fetched.length) setUsers(fetched);
                }
            }["UserProvider.useEffect"]).catch({
                "UserProvider.useEffect": ()=>{
                // Fall back silently to the local SEEDED_USERS constant — the
                // switcher still works even if the DB round-trip fails.
                }
            }["UserProvider.useEffect"]).finally({
                "UserProvider.useEffect": ()=>setLoading(false)
            }["UserProvider.useEffect"]);
        }
    }["UserProvider.useEffect"], []);
    function setActiveUserId(id) {
        setActiveUserIdState(id);
        window.localStorage.setItem(STORAGE_KEY, id);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserContext.Provider, {
        value: {
            users,
            activeUserId,
            setActiveUserId,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers/UserProvider.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(UserProvider, "m3vUo4bSRg4MFDZlKRHNPaHkD3w=");
_c = UserProvider;
function useActiveUser() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
    if (!ctx) throw new Error("useActiveUser must be used within UserProvider");
    return ctx;
}
_s1(useActiveUser, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "UserProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_03xfa-c._.js.map