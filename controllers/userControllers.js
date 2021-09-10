import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import pkg from "lodash";
const { extend } = pkg;

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, userName, password } = req.body;

  const userList = await User.find({});

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ userName });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already present.Try with different email Id");
  } else if (usernameExists) {
    res.status(400);
    throw new Error("userName already taken.Try with different userName");
  }

  const newUser = new User({
    name: name,
    email: email,
    password: password,
    userName: userName,
    avatarImage: `https://avatars.dicebear.com/api/croodles/${userList.length}.svg`,
    coverImage: `https://avatars.dicebear.com/api/croodles/${userList.length}.svg`,
    bio: "",
    website: "",
    followers: 0,
    following: 0,
  });

  const savedUser = await newUser.save();

  if (savedUser) {
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      userName: savedUser.userName,
      avatarImage: savedUser.avatarImage,
      coverImage: savedUser.coverImage,
      bio: savedUser.bio,
      website: savedUser.website,
      token: generateToken(savedUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      avatarImage: user.avatarImage,
      coverImage: user.coverImage,
      bio: user.bio,
      website: user.website,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const userList = await User.find({});
  if (!userList) {
    res.status(404).json({ success: false, message: "No users found. Sorry!" });
  }

  userList.forEach((user) => {
    user.password = undefined;
    user.__v = undefined;
    user.updatedAt = undefined;
  });

  res.status(200).json({
    totalUsers: userList.length,
    users: userList,
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  let updatedUser = req.body;
  user = extend(user, updatedUser);
  user = await user.save();
  res.json({
    user,
  });
});

const findUserById = asyncHandler(async (req, res, next, userId) => {
  const foundUser = await User.findById(userId);
  if (!foundUser) {
    return res
      .status(404)
      .json({ success: false, message: "User not found. Sorry!" });
  }
  req.user = foundUser;
  next();
});

const getSingleUser = asyncHandler(async (req, res) => {
  let { user } = req;

  res.status(200).json({
    success: true,
    user: user,
  });
});

const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { userIdToFollow } = req.body;

  let userToFollow = await User.findById(userIdToFollow).select(
    "-__v -createdAt -updatedAt -password"
  );
  let user = await User.findById(userId).select(
    "-__v -createdAt -updatedAt -password"
  );
  if (!userToFollow || !user) {
    return res.status(400).json({ success: false, message: "Users not found" });
  }

  user.following.push({ userId: userIdToFollow });
  userToFollow.followers.push({ userId: userId });

  user = await user.save();
  userToFollow = await userToFollow.save();

  res
    .status(201)
    .json({ success: true, user: user, userToFollow: userToFollow });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { userIdToUnFollow } = req.body;
  const { userId } = req.params;

  let userToUnFollow = await User.findById(userIdToUnFollow).select(
    "-__v -createdAt -updatedAt -password"
  );
  let user = await User.findById(userId).select(
    "-__v -createdAt -updatedAt -password"
  );
  if (!userToUnFollow || !user) {
    return res.status(400).json({ success: false, message: "Users not found" });
  }

  user.following = user.following.filter(
    (item) => item.userId.toString() !== userIdToUnFollow
  );
  userToUnFollow.followers = userToUnFollow.followers.filter(
    (item) => item.userId.toString() !== userId
  );

  user = await user.save();
  userToUnFollow = await userToUnFollow.save();

  res
    .status(201)
    .json({ success: true, user: user, userToUnFollow: userToUnFollow });
});

// todo : to be refactored properly

const searchByUserName = async (req, res) => {
  const { userName } = req.params;
  try {
    const foundUser = await User.findOne({ userName: userName });
    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "User  not found" });
    }
    res.status(200).json({ success: true, user: foundUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Couldn't retrieve data. Sorry!" });
  }
};

export {
  loginUser,
  registerUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchByUserName,
  findUserById,
  getSingleUser,
};
