// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
