const express = require("express");
const mongoose = require("mongoose");
const Journal = require("../models/Journal");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE journal
router.post("/", auth, async (req, res) => {
  try {
    const { text, mood } = req.body;

    const entry = await Journal.create({
      userId: req.userId,
      text,
      mood,
    });

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all journals of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE journal
router.delete("/:id", auth, async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Journal deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE journal
router.put("/:id", auth, async (req, res) => {
  try {
    const { text, mood } = req.body;

    const updated = await Journal.findByIdAndUpdate(
      req.params.id,
      { text, mood },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET mood analytics
router.get("/analytics/mood", auth, async (req, res) => {
  try {
    const stats = await Journal.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: "$mood", count: { $sum: 1 } } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
