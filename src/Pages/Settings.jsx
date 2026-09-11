import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  KeyRound,
  MessageCircle,
  Bell,
  CircleHelp,
  ArrowUpDown,
  Users,
  QrCode,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import "./Settings.css";
import BottomNav from "../Components/BottomNav";

const menuItems = [
  {
    icon: <KeyRound size={20} />,
    title: "Account",
    subtitle: "Privacy, security, change number",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "Chat",
    subtitle: "Chat history, theme, wallpapers",
  },
  {
    icon: <Bell size={20} />,
    title: "Notifications",
    subtitle: "Messages, group and others",
  },
  {
    icon: <CircleHelp size={20} />,
    title: "Help",
    subtitle: "Help center, contact us, privacy policy",
  },
  {
    icon: <ArrowUpDown size={20} />,
    title: "Storage and data",
    subtitle: "Network usage, storage usage",
  },
  { icon: <Users size={20} />, title: "Invite a friend", subtitle: "" },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="mobile-screen-wrapper">
      <div className="settings-page-container">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <Signal size={15} />
            <Wifi size={15} />
            <Battery size={18} />
          </div>
        </div>

        {/* Top Header */}
        <div className="top-header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={22} color="white" />
          </button>
          <h1 className="header-title">Settings</h1>
        </div>

        {/* White Drawer Card */}
        <div className="settings-card">
          <div className="drawer-handle-bar"></div>

          {/* Profile Section */}
          <div className="profile-section">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="profile"
              className="profile-img"
            />
            <div className="profile-info">
              <h2>Nazrul Islam</h2>
              <p>Never give up 🙌</p>
            </div>
            <button className="qr-btn" aria-label="QR Code">
              <QrCode size={22} color="#24786D" />
            </button>
          </div>

          {/* Menu List */}
          <div className="menu-list">
            {menuItems.map((item, i) => (
              <button key={i} className="menu-item">
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-text">
                  <h3>{item.title}</h3>
                  {item.subtitle && <p>{item.subtitle}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav activeTab="settings" />
      </div>
    </div>
  );
}
