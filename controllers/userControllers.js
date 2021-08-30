import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import pkg from "lodash";
const { extend } = pkg;

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, userName, password } = req.body;

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
    avatarImage: "",
    coverImage: "",
    bio: "",
    website: "",
    followers: [],
    following: [],
  });

  const savedUser = await newUser.save();

  if (savedUser) {
    res.status(201).json({
      name: savedUser.name,
      email: savedUser.email,
      userName: savedUser.userName,
      avatarImage: savedUser.avatarImage,
      coverImage: savedUser.coverImage,
      bio: savedUser.bio,
      website: savedUser.website,
      followers: savedUser.followers,
      following: savedUser.following,
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
      name: user.name,
      email: user.email,
      userName: user.userName,
      avatarImage: user.avatarImage,
      coverImage: user.coverImage,
      bio: user.bio,
      website: user.website,
      followers: user.followers,
      following: user.following,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const userList = await User.find({}).select("-__v -createdAt -updatedAt");
  if (!userList) {
    res.status(404).json({ success: false, message: "No users found. Sorry!" });
  }

  userList.forEach((user) => {
    user.password = undefined;
  });

  res.status(200).json({
    totalUsers: userList.length,
    users: userList,
  });
});
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById(_id).select(
    "-__v -createdAt -updatedAt -password"
  );

  if (user) {
    res.json({
      // success: true,
      // message: "User retrieved successfully",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  let user = await User.findById(_id).select(
    "-__v -createdAt -updatedAt -password"
  );
  let updatedUser = req.body;
  user = extend(user, updatedUser);
  user = await user.save();
  res.json({
    // success: true,
    // message: "User updated successfully",
    user,
  });
});

// todo : to be refactored properly

const followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  const { userId } = req;
  try {
    let userToFollow = await User.findById(userIdToFollow);
    let user = await User.findById(userId);
    if (!userToFollow || !user) {
      return res
        .status(400)
        .json({ success: false, message: "Users not found" });
    }
    const newFollower = {
      userId: user._id,
      userName: user.userName,
      avatarImage: user.avatarImage,
      name: user.name,
    };
    const newFollowing = {
      userId: userToFollow._id,
      userName: userToFollow.userName,
      avatarImage: userToFollow.avatarImage,
      name: userToFollow.name,
    };

    user.following.push(newFollowing);
    userToFollow.followers.push(newFollower);

    user = await user.save();
    userToFollow = await userToFollow.save();

    res
      .status(201)
      .json({ success: true, user: user, userToFollow: userToFollow });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Couldn't retrieve data. Sorry!" });
  }
};

const unfollowUser = async (req, res) => {
  const { userIdToUnFollow } = req.body;
  const { userId } = req;

  try {
    let userToUnFollow = await User.findById(userIdToUnFollow);
    let user = await User.findById(userId);
    if (!userToUnFollow || !user) {
      return res
        .status(400)
        .json({ success: false, message: "Users not found" });
    }

    user.following = user.following.filter(
      (item) => item.userId != userIdToUnFollow
    );
    userToUnFollow.followers = userToUnFollow.followers.filter(
      (item) => item.userId != userId
    );

    user = await user.save();
    userToUnFollow = await userToUnFollow.save();

    res
      .status(201)
      .json({ success: true, user: user, userToUnFollow: userToUnFollow });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Couldn't retrieve data. Sorry!" });
  }
};

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
};
