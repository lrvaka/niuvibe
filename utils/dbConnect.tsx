// utils/dbConnect.ts
import mongoose, { Mongoose } from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }

  // Use new database connection
  const db: Mongoose = await mongoose.connect(
    process.env.MONGODB_URI as string
  );

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
