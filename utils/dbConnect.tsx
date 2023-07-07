// utils/dbConnect.ts
import mongoose, { Mongoose } from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    // Use existing database connection
    return;
  }

  try {
    // Use new database connection
    const db: Mongoose = await mongoose.connect(
      process.env.MONGODB_URI as string
    );

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to database:", error);
    // You can choose to throw the error or handle it gracefully.
    // For example, you can set a flag to indicate connection failure.
    // connection.isConnected = -1;
  }
}

export default dbConnect;
