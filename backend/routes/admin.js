// backend/routes/admin.js
const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

router.delete("/messages/:id", auth, isAdmin, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
