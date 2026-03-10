import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is require"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is require"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is require"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true },
);

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
