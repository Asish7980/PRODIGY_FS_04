// backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
