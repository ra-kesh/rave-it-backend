import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/userControllers.js";

import { protect, admin } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
