import express from "express";
import {
  login,
  register,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/refresh", protect, refreshToken);

export default router;
