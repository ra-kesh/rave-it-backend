import Post from "../models/postModel.js";
import asyncHandler from "express-async-handler";

// todo : to be refactored properly

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  if (!posts) {
    return res
      .status(404)
      .json({ success: false, message: "Couldnot found any posts" });
  }
  res.status(200).json({ success: true, posts });
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
  res.status(201).json({ success: true, post: savePost });
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

const findPostById = async (req, res, next, postId) => {
  try {
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found. Sorry!" });
    }
    req.post = foundPost;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong. Sorry!" });
  }
};

const updateLike = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { post } = req;
  post.likes.push({ userId: userId });
  post.save();
  res.status(201).json({ success: true, post: post });
});

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
  addPost,
  updateLike,
  removeLike,
  findPostById,
  addComment,
  removeComment,
  removePost,
};
