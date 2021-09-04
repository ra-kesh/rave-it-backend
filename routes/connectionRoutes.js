import express from "express";
import {
  FollowUser,
  getAllConnections,
  unFollowUser,
} from "../controllers/connectionController.js";
import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/", protect, getAllConnections);

router.post("/follow", protect, FollowUser);

router.post("/unfollow", protect, unFollowUser);

export default router;
