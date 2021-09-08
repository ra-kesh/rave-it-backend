import express from "express";

const router = express.Router();

import {
  getAllPosts,
  addPost,
  updateLike,
  removeLike,
  findPostById,
  addComment,
  removeComment,
  removePost,
  getFollowingPosts,
} from "../controllers/postController.js";

import { protect } from "../middlewares/authMiddleWare.js";

router.param("postId", findPostById);

router
  .route("/")
  .get(getAllPosts)
  .post(protect, addPost)
  .delete(protect, removePost);

router.route("/feed").get(protect, getFollowingPosts);

router
  .route("/:postId/like")
  .post(protect, updateLike)
  .delete(protect, removeLike);

// router.post("/like", protect, updateLike);

// router.route("/like").post(protect).delete(protect, removeLike);

router
  .route("/:postId/comment")
  .post(protect, addComment)
  .delete(protect, removeComment);

export default router;
