import {
  ArrowLeft,
  KeyRound,
  MessageCircle,
  Bell,
  CircleHelp,
  ArrowUpDown,
  Users,
  QrCode,
  MessageSquare,
  Phone,
  Contact,
  Settings as SettingsIcon,
} from "lucide-react";
import "./Settings.css";

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

const bottomNav = [
  { icon: <MessageSquare size={22} />, label: "Message" },
  { icon: <Phone size={22} />, label: "Calls" },
  { icon: <Contact size={22} />, label: "Contacts" },
  { icon: <SettingsIcon size={22} />, label: "Settings", active: true },
];

export default function Settings() {
  return (
    <div className="settings-page">
      {/* Top black header */}
      <div className="top-header">
        <button className="back-btn">
          <ArrowLeft size={24} color="white" />
        </button>
        <h1>Settings</h1>
      </div>

      {/* White card */}
      <div className="settings-card">
        {/* Profile section */}
        <div className="profile-section">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
            className="profile-img"
          />
          <div className="profile-info">
            <h2>Nazrul Islam</h2>
            <p>Never give up 💪</p>
          </div>
          <button className="qr-btn">
            <QrCode size={22} />
          </button>
        </div>

        {/* Menu list */}
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
      <div className="bottom-nav">
        {bottomNav.map((item, i) => (
          <button key={i} className={`nav-item ${item.active ? "active" : ""}`}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
