const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const { Types } = require("mongoose");
import type { CreatePollInput, SubmitVoteInput } from "../types/service.types";



class PollService {
  static async getActivePoll() {
    return await Poll.findOne({ status: "ACTIVE" });
  }

  static async createPoll(data: CreatePollInput) {
    const activePoll = await Poll.findOne({ status: "ACTIVE" });
    if (activePoll) {
      throw new Error("Another poll is already active");
    }

    const poll = await Poll.create({
      ...data,
      startedAt: new Date(),
    });

    return poll;
  }

  static getRemainingTime(poll: any): number {
    const elapsed = Math.floor(
      (Date.now() - new Date(poll.startedAt).getTime()) / 1000
    );
    return Math.max(poll.duration - elapsed, 0);
  }

  static async submitVote(data: SubmitVoteInput) {
    const { pollId, studentId, optionId } = data;

    const existingVote = await Vote.findOne({
      pollId: new Types.ObjectId(pollId),
      studentId,
    });

    if (existingVote) {
      throw new Error("Student already voted");
    }

    await Vote.create({
      pollId,
      studentId,
      optionId,
    });

    await Poll.updateOne(
      { _id: pollId, "options.optionId": optionId },
      { $inc: { "options.$.votes": 1 } }
    );
  }

  static async endPoll(pollId: string) {
    await Poll.findByIdAndUpdate(pollId, { status: "ENDED" });
  }

  static async checkAndEndPoll(io: any, pollId: string) {
  const poll = await Poll.findById(pollId);
  if (!poll || poll.status === "ENDED") return;

  const elapsed =
    Math.floor((Date.now() - poll.startedAt.getTime()) / 1000);

  if (elapsed >= poll.duration) {
    poll.status = "ENDED";
    await poll.save();

    io.emit("poll_ended", poll);
  }
}

}


module.exports = PollService; 
