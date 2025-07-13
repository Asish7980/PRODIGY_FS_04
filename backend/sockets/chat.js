const users = {};
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join", ({ username, room }) => {
      socket.join(room);
      users[socket.id] = { username, room };
      io.to(room).emit("message", { sender: "System", text: `${username} has joined the room` });
    });

    socket.on("sendMessage", ({ text }) => {
      const user = users[socket.id];
      if (user) {
        io.to(user.room).emit("message", { sender: user.username, text });
      }
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        io.to(user.room).emit("message", { sender: "System", text: `${user.username} left the chat` });
        delete users[socket.id];
      }
    });
  });
};
