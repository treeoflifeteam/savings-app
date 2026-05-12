
import express from "express";

import {
  createCycle,
  getUserCycles,
  contributeToCycle,
} from "../controllers/cycleController.js";


import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createCycle
);

router.get(
  "/my-cycles",
  protect,
  getUserCycles
);

router.post(
  "/contribute",
  protect,
  contributeToCycle
);

export default router;
