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
  const [call, setCall] = useState(false);

  const messageMenu = () => {
    setMessage(!message);
    if (!message) setCall(false);
  };

  const callMenu = () => {
    setCall(!call);
    if (!call) setMessage(false);
  };

  return (
    <section className="message-container">
      <div className="message-header">
        <Search size={24} className="search-icon" color="white" />
        <h1>Home</h1>
        <div className="flex gap-4">
          <CircleUser size={30} />
        </div>
      </div>

      <div className="people" style={{ display: "flex", gap: "50px", marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser size={34} /> <p>status</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser size={34} />
          <p>ali</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser size={34} />
          <p>queen</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser size={34} />
          <p>victor</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser size={34} />
          <p>sam</p>
        </div>
      </div>

      {(message || call) && <div className="white-panel"></div>}

      <div className="social-footer">
        <MessageCircleMore
          onClick={messageMenu}
          size={40}
          className={`message ${message ? "active" : ""}`}
        />
        <PhoneForwarded
          onClick={callMenu}
          size={30}
          className={`message ${call ? "active" : ""}`}
        />
        <CircleUser size={30} />
        <Settings size={30} />
      </div>
    </section>
  );
}
