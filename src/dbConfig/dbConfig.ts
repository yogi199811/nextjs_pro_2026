import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Something went wrong while connecting to MongoDB", error);
    throw new Error("DB Connection Failed");
  }
}
