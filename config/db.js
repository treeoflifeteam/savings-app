import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      autoIndex: true,
    });
    console.log("MongoDB connected successfully");

    mongoose.connection.on("connected", () => {
      console.log("Database transactions enabled");
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
