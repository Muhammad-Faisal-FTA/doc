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

import dns from "node:dns";

// 1. Force Node.js to use Google and Cloudflare resolvers immediately during engine boot
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.warn("⚠️ Custom DNS configuration skipped:", error);
}

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse the connection across hot-reloads in dev and across warm serverless
// invocations in prod. Without this, every API route invocation on Vercel
// would open a brand-new connection and quickly exhaust Atlas's connection
// limit (TRD section 11 risk: "Atlas connection issues under Vercel serverless").
declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and fill in your Atlas connection string."
    );
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        // Critical Fix: Stops hanging on bad networks/DNS drops by failing after 5 seconds
        serverSelectionTimeoutMS: 5000, 
      })
      .catch((err) => {
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
