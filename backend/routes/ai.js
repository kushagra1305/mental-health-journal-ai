const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const auth = require("../middleware/authMiddleware");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST → send message + save chat
router.post("/chat", auth, async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    // 💾 save in DB
    await Chat.create({
      userId: req.userId,
      message,
      reply,
    });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "AI failed" });
  }
});

// GET → fetch history
router.get("/chat", auth, async (req, res) => {
  const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: 1 });
  res.json(chats);
});

module.exports = router;
