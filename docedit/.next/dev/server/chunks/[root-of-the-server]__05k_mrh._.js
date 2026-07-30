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
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
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
"[project]/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/users.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withErrorHandling"])(async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureUsersSeeded"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            users: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SEEDED_USERS"]
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05k_mrh._.js.map