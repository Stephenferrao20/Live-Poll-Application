import mongoose, { Schema, Document } from "mongoose";

export interface ChatMessage extends Document {
  name: string;
  role: "TEACHER" | "STUDENT";
  message: string;
}

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["TEACHER", "STUDENT"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model<ChatMessage>("ChatMessage", ChatMessageSchema);
