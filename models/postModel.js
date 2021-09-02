import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        userId: Schema.Types.ObjectId,
      },
    ],
    comments: [
      {
        userId: Schema.Types.ObjectId,
        text: String,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
