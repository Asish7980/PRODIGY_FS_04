// src/components/ChatSelector.js
import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import PrivateChat from "./PrivateChat";

export default function ChatSelector({ username }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [privateChatUser, setPrivateChatUser] = useState(null);

  const rooms = ["General", "Sports", "Music"];
  const users = ["Alice", "Bob", "Charlie"]; // Replace with your real user list

  if (currentRoom) {
    return (
      <ChatRoom
        room={currentRoom}
        username={username}
        onLeave={() => setCurrentRoom(null)}
      />
    );
  }

  if (privateChatUser) {
    return (
      <PrivateChat
        user1={username}
        user2={privateChatUser}
        onClose={() => setPrivateChatUser(null)}
      />
    );
  }

  return (
    <div>
      <h3>Choose a chat room:</h3>
      {rooms.map((r) => (
        <button key={r} onClick={() => setCurrentRoom(r)} style={{ margin: "5px" }}>
          {r}
        </button>
      ))}

      <h3>Or chat privately with:</h3>
      {users.filter((u) => u !== username).map((u) => (
        <button key={u} onClick={() => setPrivateChatUser(u)} style={{ margin: "5px" }}>
          {u}
        </button>
      ))}
    </div>
  );
}
