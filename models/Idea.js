import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    problem: { type: String, required: true, trim: true, maxlength: 500 },
    solution: { type: String, required: true, trim: true, maxlength: 500 },
    targetCustomer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    roastLevel: {
      type: String,
      enum: ["gentle", "mid", "angry"],
      required: true,
    },
    version: { type: Number, min: 1, default: 1 },
    parentIdeaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      default: null,
    },
  },
  { timestamps: true },
);

export const Idea = mongoose.model("Idea", ideaSchema);
