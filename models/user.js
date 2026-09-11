const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: [true, "Name must be unique"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);