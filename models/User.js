import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Mongoose creates `_id` automatically as the unique identifier for each user.
    // Store the user's public name so the application can identify them.
    username: { type: String, required: true, trim: true, maxlength: 40 },
    // Store the user's email for identification and keep it unique across users.
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
      unique: true,
    },
    // Store the securely hashed password; it is excluded from query results by default.
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    // Store the user's authorization role to distinguish regular users from admins.
    // Default to the least-privileged role so new users do not receive admin access.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Reference an associated user when one is assigned; null means there is no association.
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  // Automatically record when each user is created and last updated.
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
