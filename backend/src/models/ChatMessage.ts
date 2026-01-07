import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatMessage extends Document {
  name: string;
  role: "TEACHER" | "STUDENT";
  message: string;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["TEACHER", "STUDENT"],
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
