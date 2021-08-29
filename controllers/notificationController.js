import NotificationData from "../models/notificationModel.js";
import User from "../models/userModel.js";

// todo: to be refactored properly

const getNotificationDataByUserId = async (req, res, next) => {
  const { userId } = req;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "User couldn't be found. Try again" });
    }
    let notificationData = await NotificationData.findOne({ userId: userId });

    if (!notificationData) {
      notificationData = new NotificationData({
        userId: foundUser._id,
        userName: foundUser.userName,
        notifications: [],
      });
      notificationData = await notificationData.save();
    }
    req.notificationData = notificationData;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong. Sorry!" });
  }
};

const getNotificationData = async (req, res) => {
  const { notificationData } = req;
  try {
    res
      .status(200)
      .json({ success: true, notifications: notificationData.notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to retrive the NotificationData",
    });
  }
};

const addNotification = async (req, res) => {
  const { name, profileImg, type, postId, userName } = req.body;
  const { userIdToUpdate } = req.params;

  try {
    let notificationData = await NotificationData.findOne({
      userId: userIdToUpdate,
    });
    if (!notificationData) {
      return res.status(400).json({
        success: false,
        message: "Notification data of the user couldn't be found. Try again",
      });
    }

    let newNotification;

    if (postId === undefined) {
      newNotification = {
        name,
        profileImg,
        type,
        userName,
        createdAt: new Date().toISOString(),
      };
    } else {
      newNotification = {
        name,
        profileImg,
        type,
        postId,
        createdAt: new Date().toISOString(),
      };
    }
    notificationData.notifications.push(newNotification);
    notificationData = await notificationData.save();
    res.status(201).json({ success: true, message: "Notified" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong. Sorry!" });
  }
};

export { getNotificationDataByUserId, getNotificationData, addNotification };
