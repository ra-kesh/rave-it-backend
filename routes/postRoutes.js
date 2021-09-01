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
} from "../controllers/postController.js";

import { protect } from "../middlewares/authMiddleWare.js";

// router.route("/")
router.param("postId", findPostById);

router
  .route("/")
  .get(getAllPosts)
  .post(protect, addPost)
  .delete(protect, removePost);

router
  .route("/:postId/like")
  .post(protect, updateLike)
  .delete(protect, removeLike);

router
  .route("/:postId/comment")
  .post(protect, addComment)
  .delete(protect, removeComment);

export default router;
