import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "Missing authorization token" });
    }

    // Handle "Bearer <token>" format
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Middleware to verify admin role
export const isAdminProtect = async (req, res, next) => {
  try {
    // Ensure user is authenticated first
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ msg: "Unauthorized: User not authenticated" });
    }

    // Fetch user from database to check admin status
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ msg: "Forbidden: Admin access required" });
    }

    req.user.isAdmin = true;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error verifying admin status", error: error.message });
  }
};
