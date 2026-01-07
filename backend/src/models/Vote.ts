const mongoose = require("mongoose");
import type { Vote } from "../types/model.types";
const { Schema } = mongoose;

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

module.exports = mongoose.model("Vote", VoteSchema);
