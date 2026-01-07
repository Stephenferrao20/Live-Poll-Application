const { Router } = require("express");
const Poll = require("../models/Poll");

const router = Router();

router.get("/polls/history", async (req, res) => {
  try {
    const polls = await Poll.find({ status: "ENDED" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch poll history" });
  }
});

module.exports = router;
