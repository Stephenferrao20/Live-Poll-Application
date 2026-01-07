import { Router } from "express";
import { PollModel } from "../models/Poll.ts";


const router = Router();

router.get("/polls/history", async (req : any, res : any) => {
  try {
    const polls = await PollModel.find({ status: "ENDED" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch poll history" });
  }
});

export default router;
