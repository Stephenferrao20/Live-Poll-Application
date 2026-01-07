import mongoose, { Model, Schema } from "mongoose";
import type { Poll } from "../types/model.types.ts";


const OptionSchema = new Schema({
  optionId: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  isCorrect: { type: Boolean, default: false },
});

const PollSchema = new Schema(
  {
    question: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    duration: { type: Number, required: true },
    startedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);


export const PollModel: Model<Poll> =
  mongoose.models.Poll || mongoose.model<Poll>("Poll", PollSchema);