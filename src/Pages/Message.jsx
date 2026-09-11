import React from "react";
import "./Message.css";
import BottomNav from "../Components/BottomNav";
import {
  Search,
  Plus,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

export default function Message() {
  const storiesData = [
    {
      id: "my-status",
      name: "My status",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      borderColor: "white-ring",
      isMyStatus: true,
    },
    {
      id: "adil",
      name: "Adil",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      borderColor: "yellow-ring",
    },
    {
      id: "marina",
      name: "Marina",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      borderColor: "pink-ring",
    },
    {
      id: "dean",
      name: "Dean",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      borderColor: "blue-ring",
    },
    {
      id: "max",
      name: "Max",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      borderColor: "yellow-ring",
    },
  ];

  const chatList = [
    {
      id: 1,
      name: "Alex Linderson",
      message: "How are you today?",
      time: "2 min ago",
      unread: 3,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      status: "online",
      isGroup: false,
    },
    {
      id: 2,
      name: "Team Align",
      message: "Don't miss to attend the meeting.",
      time: "2 min ago",
      unread: 4,
      groupAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
      ],
      status: "online",
      isGroup: true,
    },
    {
      id: 3,
      name: "John Ahraham",
      message: "Hey! Can you join the meeting?",
      time: "2 min ago",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      status: "none",
      isGroup: false,
    },
    {
      id: 4,
      name: "Sabila Sayma",
      message: "How are you today?",
      time: "2 min ago",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      status: "offline",
      isGroup: false,
    },
    {
      id: 5,
      name: "John Borino",
      message: "Have a good day 🌸",
      time: "2 min ago",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      status: "online",
      isGroup: false,
    },
    {
      id: 6,
      name: "Angel Ram",
      message: "How are you today?",
      time: "2 min ago",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      status: "none",
      isGroup: false,
    },
  ];

  return (
    <div className="mobile-screen-wrapper">
      <div className="message-container">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <Signal size={15} />
            <Wifi size={15} />
            <Battery size={18} />
          </div>
        </div>

        {/* App Header */}
        <header className="message-header">
          <button className="search-btn" aria-label="Search">
            <Search size={18} color="white" />
          </button>
          <h1 className="header-title">Home</h1>
          <div className="user-profile-avatar">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="User profile"
            />
          </div>
        </header>

        {/* Stories / Status Row */}
        <div className="stories-section">
          <div className="stories-scroll">
            {storiesData.map((item) => (
              <div className="story-item" key={item.id}>
                <div className={`story-avatar-ring ${item.borderColor}`}>
                  <img src={item.avatar} alt={item.name} className="story-img" />
                  {item.isMyStatus && (
                    <div className="add-status-badge">
                      <Plus size={11} color="black" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="story-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* White Drawer Main Panel */}
        <main className="chat-drawer-panel">
          {/* Drag handle */}
          <div className="drawer-handle-bar"></div>

          {/* Chat List */}
          <div className="chat-list">
            {chatList.map((chat) => (
              <div className="chat-item" key={chat.id}>
                {/* Avatar wrapper */}
                <div className="chat-avatar-container">
                  {chat.isGroup ? (
                    <div className="group-avatar-grid">
                      {chat.groupAvatars.map((imgUrl, idx) => (
                        <img key={idx} src={imgUrl} alt="Group member" />
                      ))}
                    </div>
                  ) : (
                    <img src={chat.avatar} alt={chat.name} className="single-avatar" />
                  )}

                  {/* Status dot */}
                  {chat.status === "online" && (
                    <span className="status-dot online"></span>
                  )}
                  {chat.status === "offline" && (
                    <span className="status-dot offline"></span>
                  )}
                </div>

                {/* Info (Name & Subtitle) */}
                <div className="chat-info">
                  <h3 className="chat-name">{chat.name}</h3>
                  <p className="chat-preview">{chat.message}</p>
                </div>

                {/* Meta (Time & Unread count) */}
                <div className="chat-meta">
                  <span className="chat-time">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab="message" />
      </div>
    </div>
  );
}
