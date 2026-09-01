import React, { useState } from "react";
import "./Message.css";
import {
  MessageSquare,
  MessageCircleMore,
  Search,
  PhoneForwarded,
  Phone,
  Video,
  Settings,
  CircleUser,
} from "lucide-react";

export default function Message() {
  const [message, setMessage] = useState(true);

  const messageMenu = () => {
    setMessage(!message);
  };

  const sampleMessages = [
    { id: 1, name: "Ali", text: "Hey! Are we still meeting today?", time: "2 min ago" },
    { id: 2, name: "Queen", text: "Sent you the project updates.", time: "15 min ago" },
    { id: 3, name: "Victor", text: "Let's catch up later!", time: "1 hr ago" },
    { id: 4, name: "Sam", text: "Great work on the design!", time: "3 hrs ago" },
  ];

  return (
    <section className="message-container">
      <div className="message-header">
        <Search size={24} className="search-icon" color="white" />
        <h1>Home</h1>
        <div className="flex gap-4">
          <CircleUser size={30} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", marginTop: "15px", overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} /> <p style={{ fontSize: "12px", marginTop: "4px" }}>Status</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Ali</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Queen</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Victor</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p style={{ fontSize: "12px", marginTop: "4px" }}>Sam</p>
        </div>
      </div>

      {message && (
        <div className="messages-list">
          {sampleMessages.map((msg) => (
            <div key={msg.id} className="message-item">
              <CircleUser size={40} />
              <div className="message-details">
                <h3>{msg.name}</h3>
                <p>{msg.text}</p>
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="social-footer">
        <MessageCircleMore
          onClick={messageMenu}
          size={30}
          className={`message ${message ? "active" : ""}`}
        />
        <PhoneForwarded size={30} />
        <CircleUser size={30} />
        <Settings size={30} />
      </div>
    </section>
  );
}
