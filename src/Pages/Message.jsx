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
  const [contact, setContact] = useState(false);
  const [setting, setSetting] = useState(false);

  const messageMenu = () => {
    setMessage(!message);
    if (!message) {
      setCall(false);
      setContact(false);
      setSetting(false);
    }
  };

  const callMenu = () => {
    setCall(!call);
    if (!call) {
      setMessage(false);
      setContact(false);
      setSetting(false);
    }
  };

  const contactMenu = () => {
    setContact(!contact);
    if (!contact) {
      setMessage(false);
      setCall(false);
      setSetting(false);
    }
  };

  const settingMenu = () => {
    setSetting(!setting);
    if (!setting) {
      setMessage(false);
      setCall(false);
      setContact(false);
    }
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

      <div
        className="people"
        style={{ display: "flex", gap: "50px", marginTop: "10px" }}
      >
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

      {(message || call || contact || setting) && (
        <div className="white-panel"></div>
      )}

      <div className="social-footer">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MessageCircleMore
            onClick={messageMenu}
            size={30}
            className={`message ${message ? "active" : ""}`}
          />
          <span>message</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PhoneForwarded
            onClick={callMenu}
            size={30}
            className={`message ${call ? "active" : ""}`}
          />
          <span>Call</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircleUser
            size={30}
            onClick={contactMenu}
            className={`contact ${contact ? "active" : ""}`}
          />
          <span>contacts</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Settings
            size={30}
            onClick={settingMenu}
            className={`setting ${setting ? "active" : ""}`}
          />
          <span>Settings</span>
        </div>
      </div>
    </section>
  );
}
