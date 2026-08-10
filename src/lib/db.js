import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const cached = globalThis.mongooseConnection || { conn: null, promise: null };
globalThis.mongooseConnection = cached;

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required for database-backed features.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      maxPoolSize: 8,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000,
      serverSelectionTimeoutMS: 5_000,
      waitQueueTimeoutMS: 5_000,
    }).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
