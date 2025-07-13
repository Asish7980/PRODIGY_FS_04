// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const searchRoutes = require("./routes/search");
const adminRoutes = require("./routes/admin");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);

// Track online users
let onlineUsers = {};

// Socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    return next();
  } catch {
    return next(new Error("Authentication error"));
  }
});

// Socket connection
io.on("connection", (socket) => {
  const username = socket.user.username;
  onlineUsers[username] = socket.id;
  io.emit("onlineUsers", Object.keys(onlineUsers));

  // Join public room and load chat history
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(100);
    socket.emit("chatHistory", history);
  });

  // Join private chat and send history
  socket.on("joinPrivateChat", async (room) => {
    socket.join(room);
    const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(100);
    socket.emit("privateChatHistory", history);
  });

  // Public message
  socket.on("sendMessage", async ({ room, content }) => {
    const msg = await Message.create({
      sender: username,
      content,
      room,
    });
    io.to(room).emit("message", msg);
  });

  // Private message
  socket.on("sendPrivateMessage", async ({ room, content }) => {
    const msg = await Message.create({
      sender: username,
      content,
      room,
    });
    io.to(room).emit("privateMessage", msg);
  });

  // Typing indicators
  socket.on("typing", (room) => {
    socket.to(room).emit("userTyping", username);
  });

  socket.on("stopTyping", (room) => {
    socket.to(room).emit("userStopTyping", username);
  });

  // Disconnect
  socket.on("disconnect", () => {
    delete onlineUsers[username];
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
