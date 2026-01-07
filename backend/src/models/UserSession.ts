const mongoose = require("mongoose");
import type { UserSession } from "../types/model.types";
const { Schema } = mongoose;

const UserSessionSchema = new Schema(
  {
    socketId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["TEACHER", "STUDENT"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSession", UserSessionSchema);
