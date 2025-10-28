const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
    },

    googleId: {
      type: String,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
