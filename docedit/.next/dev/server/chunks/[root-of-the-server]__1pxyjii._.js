module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:dns [external] (node:dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:dns", () => require("node:dns"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase
]);
// import mongoose from "mongoose";
// const MONGODB_URI = process.env.MONGODB_URI;
// type MongooseCache = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };
// // Reuse the connection across hot-reloads in dev and across warm serverless
// // invocations in prod. Without this, every API route invocation on Vercel
// // would open a brand-new connection and quickly exhaust Atlas's connection
// // limit (TRD section 11 risk: "Atlas connection issues under Vercel serverless").
// declare global {
//   var _mongooseCache: MongooseCache | undefined;
// }
// const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
// global._mongooseCache = cache;
// export async function connectToDatabase(): Promise<typeof mongoose> {
//   if (!MONGODB_URI) {
//     throw new Error(
//       "MONGODB_URI is not set. Copy .env.example to .env.local and fill in your Atlas connection string."
//     );
//   }
//   if (cache.conn) {
//     return cache.conn;
//   }
//   if (!cache.promise) {
//     cache.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }
//   try {
//     cache.conn = await cache.promise;
//   } catch (err) {
//     cache.promise = null;
//     throw err;
//   }
//   return cache.conn;
// }
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns__$5b$external$5d$__$28$node$3a$dns$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:dns [external] (node:dns, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// 1. Force Node.js to use Google and Cloudflare resolvers immediately during engine boot
try {
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns__$5b$external$5d$__$28$node$3a$dns$2c$__cjs$29$__["default"].setServers([
        "8.8.8.8",
        "1.1.1.1"
    ]);
} catch (error) {
    console.warn("⚠️ Custom DNS configuration skipped:", error);
}
;
const MONGODB_URI = process.env.MONGODB_URI;
const cache = /*TURBOPACK member replacement*/ __turbopack_context__.g._mongooseCache ?? {
    conn: null,
    promise: null
};
/*TURBOPACK member replacement*/ __turbopack_context__.g._mongooseCache = cache;
async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local and fill in your Atlas connection string.");
    }
    if (cache.conn) {
        return cache.conn;
    }
    if (!cache.promise) {
        cache.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, {
            bufferCommands: false,
            // Critical Fix: Stops hanging on bad networks/DNS drops by failing after 5 seconds
            serverSelectionTimeoutMS: 5000
        }).catch((err)=>{
            // Clear the bad promise cache if connection immediately fails
            cache.promise = null;
            throw err;
        });
    }
    try {
        cache.conn = await cache.promise;
    } catch (err) {
        cache.promise = null;
        throw err;
    }
    return cache.conn;
}
}),
"[project]/models/Document.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const DocumentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    title: {
        type: String,
        required: true,
        trim: true,
        default: "Untitled document"
    },
    content: {
        type: String,
        default: ""
    },
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    // Flat array, not a join collection: at this scale (few users, few
    // docs) a join table buys nothing but complexity, and it keeps every
    // read to a single document fetch (see TRD section 7.2 design decision).
    sharedWith: {
        type: [
            String
        ],
        default: []
    }
}, {
    timestamps: true
});
DocumentSchema.index({
    ownerId: 1
});
DocumentSchema.index({
    sharedWith: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Document || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Document", DocumentSchema);
}),
"[project]/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    _id: false,
    versionKey: false
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("User", UserSchema);
}),
"[project]/lib/users.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/db-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureUsersSeeded",
    ()=>ensureUsersSeeded,
    "toDocumentDTO",
    ()=>toDocumentDTO
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users.ts [app-route] (ecmascript)");
;
;
;
let seeded = false;
async function ensureUsersSeeded() {
    if (seeded) return;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SEEDED_USERS"].map((u)=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateOne({
            _id: u.id
        }, {
            $set: {
                name: u.name
            }
        }, {
            upsert: true
        })));
    seeded = true;
}
function toDocumentDTO(doc) {
    return {
        _id: String(doc._id),
        title: doc.title,
        content: doc.content,
        ownerId: doc.ownerId,
        ownerName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserName"])(doc.ownerId),
        sharedWith: doc.sharedWith,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString()
    };
}
}),
"[project]/lib/import-text.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertToEditorHtml",
    ()=>convertToEditorHtml
]);
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function convertToEditorHtml(rawText, extension) {
    const lines = rawText.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    for (const line of lines){
        const trimmed = line.trim();
        if (trimmed === "") continue;
        if (extension === "md") {
            const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
            if (headingMatch) {
                const level = headingMatch[1].length;
                html.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
                continue;
            }
        }
        html.push(`<p>${escapeHtml(trimmed)}</p>`);
    }
    return html.join("") || "<p></p>";
}
}),
"[project]/lib/current-user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserIdFromHeaders",
    ()=>getUserIdFromHeaders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users.ts [app-route] (ecmascript)");
;
function getUserIdFromHeaders(headers) {
    const id = headers.get("x-user-id");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidUserId"])(id) ? id : null;
}
}),
"[project]/lib/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jsonError",
    ()=>jsonError,
    "withErrorHandling",
    ()=>withErrorHandling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function jsonError(message, status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status
    });
}
async function withErrorHandling(fn) {
    try {
        return await fn();
    } catch (err) {
        console.error("[api] unhandled error:", err);
        return jsonError("Something went wrong on the server. Please try again.", 500);
    }
}
}),
"[project]/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Document.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-text.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$current$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/current-user.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB — generous for plain text/markdown
async function POST(req) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withErrorHandling"])(async ()=>{
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$current$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserIdFromHeaders"])(req.headers);
        if (!userId) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("A valid x-user-id header is required.", 401);
        }
        let formData;
        try {
            formData = await req.formData();
        } catch  {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Request must be multipart/form-data.", 400);
        }
        const file = formData.get("file");
        if (!(file instanceof File)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("A file is required (field name 'file').", 400);
        }
        const nameParts = file.name.split(".");
        const extension = nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";
        if (extension !== "txt" && extension !== "md") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Only .txt and .md files are supported.", 400);
        }
        if (file.size === 0) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("The uploaded file is empty.", 400);
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("File is too large (2MB max).", 400);
        }
        const rawText = await file.text();
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["convertToEditorHtml"])(rawText, extension);
        const title = nameParts.join(".") || file.name;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            title: title.slice(0, 200),
            content,
            ownerId: userId,
            sharedWith: []
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            document: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toDocumentDTO"])(doc.toObject())
        }, {
            status: 201
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1pxyjii._.js.map