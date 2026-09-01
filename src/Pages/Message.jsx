import React from "react";
import "./Message.css";
import {
  MessageCircle,
  Search,
  Phone,
  Video,
  Settings,
  User,
  UserRound,
  CircleUser,
} from "lucide-react";

export default function Message() {
  return (
    <section className="message-container">
      <div className="message-header">
        <Search size={24} className="search-icon" color="black" />
        <h1>Home</h1>
        <div className="flex gap-4">
          <User size={24} />
          <UserRound size={24} />
          <CircleUser size={24} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="flex gap-4">
          <User size={24} />
          <UserRound size={24} />
          <CircleUser size={24} />
        </div>
        <div className="flex gap-4">
          <User size={24} />
          <UserRound size={24} />
          <CircleUser size={24} />
        </div>
        <div className="flex gap-4">
          <User size={24} />
          <UserRound size={24} />
          <CircleUser size={24} />
        </div>
        <div className="flex gap-4">
          <User size={24} />
          <UserRound size={24} />
          <CircleUser size={24} />
        </div> 
      </div>
    </section>
  );
}
