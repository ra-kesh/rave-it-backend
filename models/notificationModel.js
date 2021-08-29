import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  notifications: [
    {
      userName: { type: String },
      name: { type: String },
      profileImg: { type: String },
      type: { type: String },
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      createdAt: { type: Date },
    },
  ],
});

const NotificationData = mongoose.model("Notification", notificationSchema);

export default NotificationData;
