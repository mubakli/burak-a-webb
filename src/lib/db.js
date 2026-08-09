import mongoose from "mongoose";

const cached = globalThis.mongooseConnection || { conn: null, promise: null };
globalThis.mongooseConnection = cached;

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required for the trading lab.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
