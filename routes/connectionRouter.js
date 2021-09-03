import express from "express";
import {
  FollowUser,
  getAllConnections,
  unFollowUser,
} from "../controllers/connectionController.js";

const router = express.Router();

router.get("/", getAllConnections);

router.post("/follow", FollowUser);

router.post("/unfollow", unFollowUser);

export default router;
