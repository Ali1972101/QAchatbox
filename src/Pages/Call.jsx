import React, { useEffect, useState } from "react";
import "./Call.css";
import BottomNav from "../Components/BottomNav";
import {
  Search,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  PhoneCall,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Call() {
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchCalls = async () => {
      setLoading(true);
      setError(null);
      try {
        const t = token || localStorage.getItem("token");
        const res = await fetch(`${BASE}/api/calls`, {
          headers: t ? { Authorization: `Bearer ${t}` } : {},
        });
        if (!res.ok) {
          // Endpoint may not exist yet on the backend — treat as "no calls"
          // rather than throwing, so the UI still renders cleanly.
          if (!cancelled) setRecentCalls([]);
          return;
        }
        const data = await res.json().catch(() => []);
        if (!cancelled) setRecentCalls(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Could not load calls", err?.message || err);
        if (!cancelled) {
          setError("Could not load recent calls.");
          setRecentCalls([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCalls();
    return () => { cancelled = true; };
  }, [token]);

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
            {loading && <p className="muted">Loading calls...</p>}
            {!loading && error && <p className="muted">{error}</p>}
            {!loading && !error && recentCalls.length === 0 && (
              <p className="muted">No recent calls yet.</p>
            )}

            {!loading && !error && recentCalls.map((call, idx) => (
              <div className="call-item" key={call.id || call._id || idx}>
                <div className="call-avatar-container">
                  {call.isGroup ? (
                    <div className="group-avatar-grid">
                      {(call.groupAvatars || []).map((imgUrl, gidx) => (
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
