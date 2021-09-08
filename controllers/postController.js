import Post from "../models/postModel.js";
import Follower from "../models/followerModel.js";
import asyncHandler from "express-async-handler";

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("postedBy", "-password");

  if (!posts) {
    return res
      .status(404)
      .json({ success: false, message: "Couldnot found any posts" });
  }
  res.status(200).json({ success: true, posts });
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  const followingUsers = await Follower.find(
    { user: req.user._id },
    "following"
  );
  const followingPosts = await Post.find({
    postedBy: {
      $in: [...followingUsers.map((obj) => obj.following), req.user._id],
    },
  })
    .populate("postedBy", "-password")
    .limit(30);

  res.json({
    success: true,
    followingPosts: followingPosts,
  });
});

const addPost = asyncHandler(async (req, res) => {
  const { postedBy, content } = req.body;

  const newPost = new Post({
    postedBy,
    content,
    likes: [],
    comments: [],
  });

  const savePost = await newPost.save();
  savedPost.populate("postedBy", "-password");
  res.status(201).json({ success: true, post: savedPost });
});

const removePost = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const foundPost = await Post.findById(postId);

  if (!foundPost) {
    return res
      .status(404)
      .json({ success: false, message: "Post not found. Sorry!" });
  } else {
    foundPost.remove();
    res.status(200).json({ success: true, removedPost: foundPost });
  }
});

const findPostById = asyncHandler(async (req, res, next, postId) => {
  const foundPost = await Post.findById(postId);
  if (!foundPost) {
    return res
      .status(404)
      .json({ success: false, message: "Post not found. Sorry!" });
  }
  req.post = foundPost;
  next();
});

const updateLike = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { post } = req;
  post.likes.push({ userId: userId });
  await post.save();
  const updatedPost = post.populate("postedBy", "-password");
  res.status(201).json({ success: true, post: updatedPost });
});

// const updateLike = asyncHandler(async (req, res) => {
//   const { postId } = req.body;
//   const post = await Post.findOneAndUpdate(
//     { _id: postId },
//     { $push: { likes: req.user._id } },
//     { upsert: true }
//   );
//   const updatedPost = post.populate("postedBy", "-password");

//   res.status(201).json({ success: true, post: updatedPost });
// });

const removeLike = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { post } = req;
  post.likes = post.likes.filter((item) => item.userId.toString() !== userId);
  await post.save();
  res.status(200).json({ success: true, post: post });
});

const addComment = asyncHandler(async (req, res) => {
  const { userId, text } = req.body;
  const { post } = req;
  post.comments.push({
    userId,
    text,
    createdAt: new Date().toISOString(),
  });
  post.save();
  res.status(201).json({ success: true, post: post });
});

const removeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  const { post } = req;
  const foundComment = post.comments.find(
    (item) => item._id.toString() === commentId
  );
  if (!foundComment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found. Sorry!" });
  }
  post.comments = post.comments.filter(
    (item) => item._id.toString() !== commentId
  );
  post.save();
  res.status(200).json({ success: true, post: post });
});

export {
  getAllPosts,
  getFollowingPosts,
  addPost,
  updateLike,
  removeLike,
  findPostById,
  addComment,
  removeComment,
  removePost,
};
