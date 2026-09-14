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
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import "./Settings.css";
import BottomNav from "../Components/BottomNav";
import { useAuth } from "../../hooks/useAuth.jsx";
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
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
      let res = await fetch('http://localhost:5000/api/users/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: form,
      });
      let data = await res.json().catch(() => ({}));

      if (!res.ok) {
       
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

        
        <BottomNav activeTab="settings" />
      </div>
    </div>
  );
}
