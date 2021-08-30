import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchByUserName,
  getAllUsers,
} from "../controllers/userControllers.js";

import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/profile/:_id", protect, getUserProfile);
router.post("/profile/:_id", protect, updateUserProfile);
router.get("/", getAllUsers);

router.route("/follow").post(protect, followUser).delete(protect, unfollowUser);

router.route("/search/:userName").get(protect, searchByUserName);

export default router;
