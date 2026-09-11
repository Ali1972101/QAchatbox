import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Phone, CircleUser, Settings } from "lucide-react";
import "./BottomNav.css";

export default function BottomNav({ activeTab }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "message", label: "Message", path: "/message", icon: MessageSquare },
    { id: "calls", label: "Calls", path: "/call", icon: Phone },
    { id: "contacts", label: "Contacts", path: "/contact", icon: CircleUser },
    { id: "settings", label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="bottom-nav-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-btn ${isActive ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            <div className="nav-icon-wrapper">
              <Icon size={22} />
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
