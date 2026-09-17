import React, { useRef, useState } from "react";
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
  Plus,
  LogOut,
} from "lucide-react";
import "./Settings.css";
import BottomNav from "../Components/BottomNav";
import { useAuth } from "../../hooks/useAuth.jsx";
import { disconnectSocket } from "../lib/socket";
import blank from "../assets/Images/blank.png";

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
  {
    icon: <LogOut size={20} />,
    title: "Logout",
    subtitle: "",
    action: "logout",
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, token, setUser, logout } = useAuth();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('avatar', file);
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        console.warn('No auth token available for image upload');
        setLoading(false);
        return;
      }

      // try the new endpoint first
      let res = await fetch('http://localhost:5000/api/users/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: form,
      });
      let data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // fallback to legacy endpoint
        res = await fetch('http://localhost:5000/api/users/upload-avatar', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
          body: form,
        });
        data = await res.json().catch(() => ({}));
      }

      if (res.ok) {
        setUser(data.user);
      } else {
        console.warn('Image upload failed', data);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleMenuItemClick = (item) => {
    if (item.action === 'logout') {
      setShowLogoutConfirm(true);
    }
  };

  const confirmLogout = () => {
    // Prefer whatever logout the auth hook provides; fall back to
    // clearing the token/user manually if it doesn't expose one.
    if (typeof logout === 'function') {
      logout();
    } else {
      try { localStorage.removeItem('token'); } catch (e) {}
      if (typeof setUser === 'function') setUser(null);
    }
    // Tear down the shared socket connection so no more messages/events
    // are received under the old session.
    disconnectSocket();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <div className="mobile-screen-wrapper">
      <div className="settings-page-container">
        <div className="top-header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={22} color="white" />
          </button>
          <h1 className="header-title">Settings</h1>
        </div>

        <div className="settings-card">
          <div className="drawer-handle-bar"></div>

          <div className="profile-section">
            <div className="profile-img-wrapper">
              <img
                src={user?.imageUrl ? `http://localhost:5000${user.imageUrl}` : blank}
                alt="profile"
                className="profile-img"
              />
              <button className="add-image-badge" aria-label="Add image" onClick={() => fileRef.current && fileRef.current.click()}>
                <Plus size={14} color="#24786D" />
              </button>
            </div>
            <div className="profile-info">
              <h2>{user?.name || 'Your name'}</h2>
              <p>{user?.statusText || ''}</p>
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange} />
              <button className="qr-btn" aria-label="Upload image" onClick={() => fileRef.current && fileRef.current.click()}>
                {loading ? 'Uploading...' : <QrCode size={22} color="#24786D" />}
              </button>
            </div>
          </div>

          <div className="menu-list">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="menu-item"
                onClick={() => handleMenuItemClick(item)}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-text">
                  <h3>{item.title}</h3>
                  {item.subtitle && <p>{item.subtitle}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <BottomNav activeTab="settings" />

        {showLogoutConfirm && (
          <div
            className="logout-confirm-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
            onClick={cancelLogout}
          >
            <div
              className="logout-confirm-dialog"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: 24,
                width: '80%',
                maxWidth: 320,
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <p style={{ margin: '0 0 20px 0', fontSize: 16, color: '#111' }}>
                Do you want to logout?
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={cancelLogout}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    background: 'white',
                    color: '#333',
                    cursor: 'pointer',
                  }}
                >
                  No
                </button>
                <button
                  onClick={confirmLogout}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: 'none',
                    background: '#e04b4b',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

