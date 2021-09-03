import mongoose from "mongoose";
const { Schema } = mongoose;

const FollowerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  following: { type: Schema.Types.ObjectId, ref: "User" },
});

const Follower = mongoose.model("Follower", FollowerSchema);

export default Follower;
