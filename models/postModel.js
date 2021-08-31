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
        userName: String,
      },
    ],
    comments: [
      {
        userName: String,
        name: String,
        profileImg: String,
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
