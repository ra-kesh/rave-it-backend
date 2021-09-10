import Post from "../models/postModel.js";
import Follower from "../models/followerModel.js";
import asyncHandler from "express-async-handler";

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate([
    {
      path: "postedBy likes.user comments.user",
      model: "User",
      select: ["_id,", "name", "userName", "avatarImage"],
    },
  ]);

  if (!posts) {
    return res
      .status(404)
      .json({ success: false, message: "Couldnot found any posts" });
  }
  res.status(200).json({ success: true, posts });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ postedBy: userId })
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    userPosts: posts,
  });
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  // let followingUsers = await Follower.find({ user: req.user._id }).populate([
  //   {
  //     path: "following",
  //     model: "User",
  //     select: ["_id", "name", "userName", "avatarImage"],
  //   },
  // ]);

  const followingUsers = await Follower.find(
    { user: req.user._id },
    "following"
  );
  const followingPosts = await Post.find({
    postedBy: {
      $in: [...followingUsers.map((obj) => obj.following), req.user._id],
    },
  })
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .limit(30);

  res.json({
    success: true,
    followingPosts: followingPosts,
  });
});

const addPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const newPost = await Post.create({
    postedBy: req.user._id,
    content: content,
    likes: [],
    comments: [],
  });

  const populatedPost = await newPost
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();

  res.status(201).json({ success: true, post: populatedPost });
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
  const populatedPost = await foundPost
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();
  req.post = populatedPost;
  next();
});

const fetchSinglePost = asyncHandler(async (req, res) => {
  let { post } = req;

  res.status(200).json({
    success: true,
    post: post,
  });
});

const updateLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);
  post.likes.push({ user: req.user._id });
  await post.save();
  const updatedPost = await post
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();
  res.status(201).json({ success: true, post: updatedPost });
});

const removeLike = asyncHandler(async (req, res) => {
  const { postId, userId } = req.body;
  const post = await Post.findById(postId);
  post.likes = post.likes.filter((item) => item.user.toString() !== userId);
  await post.save();
  const updatedPost = await post
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();
  res.status(200).json({ success: true, post: updatedPost });
});

const addComment = asyncHandler(async (req, res) => {
  const { postId, text } = req.body;
  const post = await Post.findById(postId);
  post.comments.push({
    user: req.user._id,
    text,
    createdAt: new Date().toISOString(),
  });
  await post.save();

  const updatedPost = await post
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();

  res.status(201).json({ success: true, post: updatedPost });
});

const removeComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.body;
  const post = await Post.findById(postId);
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
  await post.save();
  const updatedPost = await post
    .populate([
      {
        path: "postedBy likes.user comments.user",
        model: "User",
        select: ["_id,", "name", "userName", "avatarImage"],
      },
    ])
    .execPopulate();
  res.status(200).json({ success: true, post: updatedPost });
});

export {
  getAllPosts,
  getFollowingPosts,
  fetchSinglePost,
  addPost,
  updateLike,
  removeLike,
  findPostById,
  addComment,
  removeComment,
  removePost,
  getUserPosts,
};
