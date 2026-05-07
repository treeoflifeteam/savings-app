import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";

export const register = catchAsync(async (req, res) => {
  const { name, phone, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new AppError("Phone number already registered", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    phone,
    password: hashed,
    isAdmin: false,
    walletBalance: 0,
    currentCycle: null,
    cycles: [],
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(201).json({
    msg: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      walletBalance: user.walletBalance,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    msg: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      walletBalance: user.walletBalance,
      currentCycle: user.currentCycle,
    },
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    msg: "Token refreshed successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      walletBalance: user.walletBalance,
      currentCycle: user.currentCycle,
    },
  });
});
