import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactions: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

voteSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
