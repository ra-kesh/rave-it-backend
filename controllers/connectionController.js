import asyncHandler from "express-async-handler";
import Follower from "../models/followerModel.js";
import User from "../models/userModel.js";

export const getAllConnections = asyncHandler(async (req, res) => {
  const followingIds = await Follower.find({ user: req.uid }, "following");
  const followerIds = await Follower.find({ following: req.uid }, "user");

  const suggestions = await User.find({
    _id: {
      $nin: [
        ...followingIds.map((obj) => obj.following),
        ...followerIds.map((obj) => obj.user),
      ],
      $ne: req.uid,
    },
  }).limit(10);

  const followers = await Follower.find({ following: req.uid }).populate(
    "user"
  );
  const following = await Follower.find({ user: req.uid }).populate(
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
    user: req.uid,
    following: followId,
  });
  const user = await Profile.findOneAndUpdate(
    { user: req.uid },
    { $inc: { following: 1 } }
  );
  const follower = await Profile.findOneAndUpdate(
    { user: followId },
    { $inc: { followers: 1 } }
  );

  res.json({
    success: true,
  });
});

export const unFollowUser = asyncHandler(async (req, res) => {
  const { followId } = req.body;
  const connection = await Follower.deleteOne({
    user: req.uid,
    following: followId,
  });
  const user = await Profile.findOneAndUpdate(
    { user: req.uid },
    { $inc: { following: -1 } }
  );
  const follower = await Profile.findOneAndUpdate(
    { user: followId },
    { $inc: { followers: -1 } }
  );

  res.json({
    success: true,
  });
});
