import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const cached = (global as any).mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      m.connection.collection("users").dropIndex("email_1").catch(() => {});
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
