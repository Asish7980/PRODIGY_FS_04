import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function ChatRoom({ room, username, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (room && room.trim() !== "") {
      socket.emit("joinRoom", room);
    }

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      if (room && room.trim() !== "") {
        socket.emit("leaveRoom", room);
      }
      socket.off("message", handleMessage);
    };
  }, [room]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", { room, content: input });
    setInput("");
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <div
        style={{ height: "300px", overflowY: "auto", border: "1px solid black", padding: "5px", marginBottom: "10px" }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender}</b>: {m.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>

      <br />
      <button onClick={onLeave} style={{ marginTop: "10px" }}>
        Leave Room
      </button>
    </div>
  );
}
