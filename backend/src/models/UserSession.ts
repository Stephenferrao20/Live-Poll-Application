import mongoose, { Model, Schema } from "mongoose";
import type { UserSession } from "../types/model.types.ts";


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


export const UserSessionModel: Model<UserSession> =
  mongoose.models.UserSession || mongoose.model<UserSession>("UserSession", UserSessionSchema);