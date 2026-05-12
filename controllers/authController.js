import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

// ======================================
// REGISTER
// ======================================

export const register = async (req, res) => {
  try {
    const { fullName, phone, password, role } = req.body;

    const savingsCode = generateSavingsCode(fullName);

    // ==============================
    // VALIDATION
    // ==============================

    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    // ==============================
    // EXISTING USER
    // ==============================

    const existingUser = await User.findOne({
      phone,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "Phone already exists",
      });
    }

    // ==============================
    // CREATE USER
    // ==============================

    const user = await User.create({
      fullName,
      phone,
      password,
      savingsCode,
      role: role || "user",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,

      token,

      user: {
        id: user._id,

        fullName: user.fullName,

        phone: user.phone,

        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,

      error,
    });
  }
};

// ======================================
// GENERATE SAVINGS CODE
// ======================================
const generateSavingsCode = (fullName) => {
  const firstName = fullName.split(" ")[0].toUpperCase();

  const digits = Math.floor(10 + Math.random() * 90);

  return `${firstName}TOL${digits}`;
};

// ======================================
// LOGIN
// ======================================

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // ==============================
    // FIND USER
    // ==============================

    const user = await User.findOne({
      phone,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    // ==============================
    // CHECK PASSWORD
    // ==============================

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid credentials",
      });
    }

    // ==============================
    // BLOCK CHECK
    // ==============================

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,

        message: "Account blocked",
      });
    }

    user.lastLogin = new Date();

    await user.save();

    // ==============================
    // TOKEN
    // ==============================

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,

      token,

      user: {
        id: user._id,

        fullName: user.fullName,

        phone: user.phone,

        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Login failed",
    });
  }
};

// ======================================
// GET CURRENT USER
// ======================================

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,

    user: req.user,
  });
};
