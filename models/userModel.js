import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name cannot be blank",
      minLength: [2, "Name should be atleast 2 character long"],
    },
    email: {
      type: String,
      unique: true,
      required: "Valid email address required",
    },
    userName: {
      type: String,
      unique: true,
      required: "Username required",
      minLength: [2, "Username should be atleast 2 character long"],
    },
    password: {
      type: String,
      required: "vaild password required",
      minLength: [6, "Password should be atleast 6 character long"],
    },
    avatarImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    followers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    following: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
