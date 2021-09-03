import express from "express";
import {
  FollowUser,
  getAllConnections,
  unFollowUser,
} from "../controllers/connectionController.js";

const router = express.Router();

import { protect } from "./middlewares/authMiddleWare.js";
router.get("/", protect, getAllConnections);

router.post("/follow", protect, FollowUser);

router.post("/unfollow", protect, unFollowUser);

export default router;
