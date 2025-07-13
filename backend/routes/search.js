// backend/routes/search.js
const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { room, q } = req.query;
  const msgs = await Message.find({
    room,
    content: { $regex: q, $options: "i" }
  }).sort({ timestamp: -1 }).limit(50);
  res.json(msgs);
});

module.exports = router;
