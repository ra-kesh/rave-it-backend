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
  findUserById,
  getSingleUser,
} from "../controllers/userControllers.js";

import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.param("userId", findUserById);

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/profile", protect, getUserProfile);
router.post("/profile", protect, updateUserProfile);
router.get("/", getAllUsers);
router.get("/:userId", getSingleUser);

router
  .route("/follow/:userId")
  .post(protect, followUser)
  .delete(protect, unfollowUser);

router.route("/search/:userName").get(protect, searchByUserName);

export default router;
