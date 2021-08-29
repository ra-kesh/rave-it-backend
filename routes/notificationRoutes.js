import express from "express";
const router = express.Router();

import {
  getNotificationData,
  addNotification,
  getNotificationDataByUserId,
} from "../controllers/notificationController.js";

router.route("/").get(getNotificationDataByUserId, getNotificationData);

router.route("/:userIdToUpdate").post(addNotification);

export default router;
