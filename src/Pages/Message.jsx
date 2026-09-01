import React from "react";
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
  return (
    <section className="message-container">
      <div className="message-header">
        <Search size={24} className="search-icon" color="white" />
        <h1>Home</h1>
        <div className="flex gap-4">
          <CircleUser size={30} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "50px", marginTop: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} /> <p>status</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p>ali</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p>queen</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p>victor</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircleUser size={34} />
          <p>sam</p>
        </div>
      </div>

      <div className="social-footer">
        <MessageCircleMore size={30} />
        <PhoneForwarded size={30} />
        <CircleUser size={30} />
        <Settings size={30} />
      </div>
    </section>
  );
}
