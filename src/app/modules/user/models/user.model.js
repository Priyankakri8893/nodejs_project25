const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    roleId: {
      type: Number,
      default: 0,
    }, // 0 for user and 1 for teacher
    role: {
      type: String,
      enum: ["teacher", "user"],
      default: "user",
    },
    otp: { type: String, required: true, trim: true },
    otpDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { User };
