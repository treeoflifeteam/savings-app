import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/savings-app",
    );

    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log(
        "Admin user already exists:",
        existingAdmin.name,
        existingAdmin.phone,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      name: "Admin User",
      phone: "08000000000", // Change this to your desired phone
      password: hashedPassword,
      isAdmin: true,
      walletBalance: 0,
      currentCycle: null,
      cycles: [],
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Phone: 08000000000");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();
