import React from "react";
import "./Call.css";
import BottomNav from "../Components/BottomNav";
import {
  Search,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Wifi,
  Battery,
  Signal,
  PhoneCall,
} from "lucide-react";

export default function Call() {
  const recentCalls = [
    {
      id: 1,
      name: "Team Align",
      time: "Today, 09:30 AM",
      type: "incoming",
      isGroup: true,
      groupAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
      ],
    },
    {
      id: 2,
      name: "Jhon Abraham",
      time: "Today, 07:30 AM",
      type: "incoming",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      isGroup: false,
    },
    {
      id: 3,
      name: "Sabila Sayma",
      time: "Yesterday, 07:35 PM",
      type: "missed",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      isGroup: false,
    },
    {
      id: 4,
      name: "Alex Linderson",
      time: "Monday, 09:30 AM",
      type: "outgoing",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      isGroup: false,
    },
    {
      id: 5,
      name: "Jhon Abraham",
      time: "03/07/22, 07:30 AM",
      type: "missed",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      isGroup: false,
    },
    {
      id: 6,
      name: "John Borino",
      time: "Monday, 09:30 AM",
      type: "outgoing",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      isGroup: false,
    },
  ];

  const renderCallIcon = (type) => {
    if (type === "incoming") {
      return <PhoneIncoming size={15} className="call-type-icon incoming" />;
    }
    if (type === "missed") {
      return <PhoneMissed size={15} className="call-type-icon missed" />;
    }
    return <PhoneOutgoing size={15} className="call-type-icon outgoing" />;
  };

  return (
    <div className="mobile-screen-wrapper">
      <div className="call-page-container">
       

        
        <header className="call-header">
          <button className="header-icon-btn" aria-label="Search">
            <Search size={18} color="white" />
          </button>
          <h1 className="header-title">Calls</h1>
          <button className="header-icon-btn" aria-label="New call">
            <PhoneCall size={18} color="white" />
          </button>
        </header>

        
        <main className="call-drawer-panel">
          
          <div className="drawer-handle-bar"></div>

          <h2 className="recent-section-title">Recent</h2>

          
          <div className="calls-list">
              {recentCalls.map((call, idx) => (
                <div className="call-item" key={call.id || idx}>
               
                <div className="call-avatar-container">
                  {call.isGroup ? (
                    <div className="group-avatar-grid">
                      {call.groupAvatars.map((imgUrl, gidx) => (
                        <img key={gidx} src={imgUrl} alt="Group member" />
                      ))}
                    </div>
                    ) : (
                    <img
                      src={call.image}
                      alt={call.name}
                      className="single-avatar"
                    />
                  )}
                </div>

              
                <div className="call-info">
                  <h3 className="call-name">{call.name}</h3>
                  <div className="call-meta-row">
                    {renderCallIcon(call.type)}
                    <span className="call-time-text">{call.time}</span>
                  </div>
                </div>

                
                <div className="call-action-btns">
                  <button className="action-btn" aria-label="Audio Call">
                    <Phone size={20} color="#797C7B" />
                  </button>
                  <button className="action-btn" aria-label="Video Call">
                    <Video size={22} color="#797C7B" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        
        <BottomNav activeTab="calls" />
      </div>
    </div>
  );
}
