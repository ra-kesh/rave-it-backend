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
  fetchSinglePost,
  getOwnPosts,
} from "../controllers/postController.js";

import { protect } from "../middlewares/authMiddleWare.js";

router.param("postId", findPostById);

router.route("/:postId").get(fetchSinglePost);

router
  .route("/")
  .get(getAllPosts)
  .post(protect, addPost)
  .delete(protect, removePost);

router.route("/feed/personal").get(protect, getFollowingPosts);
router.route("/feed/own").get(protect, getOwnPosts);

router.route("/like").post(protect, updateLike);
router.route("/dislike").post(protect, removeLike);

router
  .route("/comment")
  .post(protect, addComment)
  .delete(protect, removeComment);

export default router;
