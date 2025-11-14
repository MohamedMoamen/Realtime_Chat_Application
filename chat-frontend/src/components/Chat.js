import { useState, useEffect } from "react";
import api from "../api/axios";
import { createEcho } from "../echo";
import Sidebar from "./Sidebar";
import Message from "./Message";

export default function Chat({ logout, currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.filter((u) => u.id !== currentUser.id));
    };
    fetchUsers();
  }, [currentUser.id]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currentUser || !token) return;

    const echoInstance = createEcho();
    const channelName = `chat.${currentUser.id}`;
    console.log("Subscribing to channel:", channelName);

    const channel = echoInstance.private(channelName);

    channel.subscribed(() => {
      console.log("Successfully subscribed to channel:", channelName);
    });

    channel.listen(".message.sent", (message) => {
      console.log("Received message:", message);
      if (!selectedUser) return;
      if (
        message.sender_id === selectedUser.id ||
        message.receiver_id === selectedUser.id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      channel.stopListening(".message.sent");
      echoInstance.leave(channelName);
    };
  }, [currentUser?.id, selectedUser]);

  
  const selectUser = async (user) => {
    setSelectedUser(user);
    const token = localStorage.getItem("token");

    const res = await api.get(`/messages?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(res.data);
  };

  
  const handleSend = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/messages",
      {
        body: newMessage,
        receiver_id: selectedUser.id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        users={users}
        selectUser={selectUser}
        selectedUser={selectedUser}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>{selectedUser ? selectedUser.name : "Select a user"}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "scroll",
            padding: "10px",
            backgroundColor: "#f3f4f6",
          }}
        >
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              currentUserId={currentUser.id}
            />
          ))}
        </div>

        {selectedUser && (
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ccc",
            }}
          >
            <input
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                borderRadius: "5px",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
