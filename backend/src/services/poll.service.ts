import { Types } from "mongoose";
import { PollModel } from "../models/Poll.ts";
import { VoteModel } from "../models/Vote.ts";
import type {
  CreatePollInput,
  SubmitVoteInput,
} from "../types/service.types.ts";
import type { Server } from "socket.io";

class PollService {
  /* ---------- Poll ---------- */

  static async getActivePoll() {
    return PollModel.findOne({ status: "ACTIVE" });
  }

  static async createPoll(data: CreatePollInput) {
    const activePoll = await PollModel.findOne({ status: "ACTIVE" });
    if (activePoll) {
      throw new Error("Another poll is already active");
    }

    return PollModel.create({
      ...data,
      startedAt: new Date(),
    });
  }

  static getRemainingTime(poll: any): number {
    const elapsed = Math.floor(
      (Date.now() - poll.startedAt.getTime()) / 1000
    );
    return Math.max(poll.duration - elapsed, 0);
  }

  /* ---------- Voting ---------- */

  static async submitVote(data: SubmitVoteInput) {
    const { pollId, studentId, optionId } = data;

    const existingVote = await VoteModel.findOne({
      pollId: new Types.ObjectId(pollId),
      studentId,
    });

    if (existingVote) {
      throw new Error("Student already voted");
    }

    await VoteModel.create({
      pollId,
      studentId,
      optionId,
    });

    await PollModel.updateOne(
      { _id: pollId, "options.optionId": optionId },
      { $inc: { "options.$.votes": 1 } }
    );
  }

  /* ---------- Poll End ---------- */

  static async endPoll(pollId: string) {
    await PollModel.findByIdAndUpdate(pollId, {
      status: "ENDED",
    });
  }

  static async checkAndEndPoll(
    io: Server,
    pollId: string
  ): Promise<boolean> {
    const poll = await PollModel.findById(pollId);
    if (!poll || poll.status === "ENDED") return false;

    const now = Date.now();
    const endTime =
      poll.startedAt!.getTime() + poll.duration * 1000;

    if (now >= endTime) {
      poll.status = "ENDED";
      await poll.save();

      io.emit("poll_ended", poll);
      return true; // ✅ IMPORTANT
    }

    return false;
  }
}

export default PollService;
