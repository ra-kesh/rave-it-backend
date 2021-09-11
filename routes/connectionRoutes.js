import express from "express";
import {
  FollowUser,
  getAllConnections,
  unFollowUser,
  getUserConnections,
} from "../controllers/connectionController.js";
import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/", protect, getAllConnections);

router.get("/:userId", getUserConnections);

router.post("/follow", protect, FollowUser);

router.post("/unfollow", protect, unFollowUser);

export default router;
