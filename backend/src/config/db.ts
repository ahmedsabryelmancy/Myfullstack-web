import mongoose from "mongoose";

// Cached promise keeps one connection alive across warm serverless invocations.
// On a cold start the cache is empty and a fresh connection is made.
let connectionPromise: Promise<void> | null = null;

export async function connectDB(): Promise<void> {
  // Already fully connected — nothing to do
  if (mongoose.connection.readyState === 1) return;

  // A connect() call is already in flight — wait for it instead of opening a second socket
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in environment variables.");

  connectionPromise = mongoose
    .connect(uri, {
      bufferCommands: false, // fail fast instead of queuing ops while disconnected
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("MongoDB connected.");
    })
    .catch((err: unknown) => {
      connectionPromise = null; // allow retry on next request
      throw err;
    });

  await connectionPromise;
}
