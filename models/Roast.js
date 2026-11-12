import mongoose from "mongoose";

const roastSchema = new mongoose.Schema(
  {
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
    investorName: {
      type: String,
      enum: ["strict", "funny", "dreamer"],
      required: true,
    },
    score: { type: Number, required: true, min: 1, max: 10 },
    roast: { type: String, required: true, maxlength: 500 },
    tip: { type: String, required: true, maxlength: 300 },
    fundingAmount: { type: Number, required: true, min: 0 },
    equityPercentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

roastSchema.index({ ideaId: 1, investorName: 1 }, { unique: true });

export const Roast = mongoose.model("Roast", roastSchema);
