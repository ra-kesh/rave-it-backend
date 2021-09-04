import asyncHandler from "express-async-handler";
import Follower from "../models/followerModel.js";
import User from "../models/userModel.js";

export const getAllConnections = asyncHandler(async (req, res) => {
  const followingIds = await Follower.find({ user: req.user._id }, "following");
  const followerIds = await Follower.find({ following: req.user._id }, "user");

  const suggestions = await User.find({
    _id: {
      $nin: [
        ...followingIds.map((obj) => obj.following),
        ...followerIds.map((obj) => obj.user),
      ],
      $ne: req.user._id,
    },
  }).limit(10);

  const followers = await Follower.find({ following: req.user._id }).populate(
    "user"
  );
  const following = await Follower.find({ user: req.user._id }).populate(
    "following"
  );

  res.json({
    success: true,
    following: following.map((obj) => obj.following),
    followers: followers.map((obj) => obj.user),
    suggestions: suggestions,
  });
});

export const FollowUser = asyncHandler(async (req, res) => {
  const { followId } = req.body;

  const connection = await Follower.create({
    user: req.user._id,
    following: followId,
  });
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: { following: 1 } }
  );
  const follower = await User.findOneAndUpdate(
    { _id: followId },
    { $inc: { followers: 1 } }
  );

  res.json({
    success: true,
  });
});

export const unFollowUser = asyncHandler(async (req, res) => {
  const { followId } = req.body;
  const connection = await Follower.deleteOne({
    user: req.user._id,
    following: followId,
  });
  const user = await User.findOneAndUpdate(
    { user: req.user._id },
    { $inc: { following: -1 } }
  );
  const follower = await User.findOneAndUpdate(
    { user: followId },
    { $inc: { followers: -1 } }
  );

  res.json({
    success: true,
  });
});
