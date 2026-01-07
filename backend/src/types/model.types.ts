import type mongoose from "mongoose";
import type { Document } from "mongoose";

export interface Option {
  optionId: string;
  text: string;
  votes: number;
  isCorrect: boolean;
}

export interface Poll extends Document {
  question: string;
  options: Option[];
  duration: number;
  startedAt: Date | null;
  status: "ACTIVE" | "ENDED";
}

export interface Vote extends Document {
  pollId: mongoose.Types.ObjectId;
  studentId: string;
  optionId: string;
}

export interface UserSession extends Document {
  socketId: string;
  name: string;
  role: "TEACHER" | "STUDENT";
}

export interface ChatMessage extends Document {
  name: string;
  role: "TEACHER" | "STUDENT";
  message: string;
}