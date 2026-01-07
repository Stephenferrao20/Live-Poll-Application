import mongoose, { Model, Schema } from "mongoose";
import { Vote } from "../types/model.types.ts";


const VoteSchema = new Schema(
  {
    pollId: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    optionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });


export const VoteModel: Model<Vote> =
  mongoose.models.Vote || mongoose.model<Vote>("Vote", VoteSchema);