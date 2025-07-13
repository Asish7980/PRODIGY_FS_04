// src/components/PrivateChat.js
import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function PrivateChat({ user1, user2, onClose }) {
  const room = [user1, user2].sort().join("_");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinPrivateChat", room);

    const handlePrivateMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleHistory = (history) => {
      setMessages(history);
    };

    socket.on("privateMessage", handlePrivateMessage);
    socket.on("privateChatHistory", handleHistory);

    return () => {
      socket.emit("leavePrivateChat", room);
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("privateChatHistory", handleHistory);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendPrivateMessage", {
      room,
      content: input,
      sender: user1,
    });
    setInput("");
  };

  return (
    <div>
      <h2>Private chat: {user1} & {user2}</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid black", padding: "5px", marginBottom: "10px" }}>
        {messages.length === 0 && <i>No messages yet.</i>}
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender}</b>: {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} disabled={!input.trim()}>Send</button>

      <br />
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Close Chat
      </button>
    </div>
  );
}
