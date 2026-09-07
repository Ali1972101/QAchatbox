import React from "react";
import "./Contact.css";
import {
  Search,
  UserCircle,
  MessageCircle,
  Phone,
  Users,
  Settings,
} from "lucide-react";

const contactsData = [
  {
    id: "1",
    name: "Afrin Sabila",
    status: "Life is beautiful 🙌",
    avatar: "https://i.pravatar.cc/150?img=1",
    section: "A",
  },
  {
    id: "3",
    name: "Bristy Haque",
    status: "Keep working 💪",
    avatar: "https://i.pravatar.cc/150?img=3",
    section: "B",
  },

  {
    id: "6",
    name: "sheik Sadi",
    status: "",
    avatar: "https://i.pravatar.cc/150?img=6",
    section: "c",
  },
];

// Group contacts by section
const groupedContacts = contactsData.reduce((acc, item) => {
  if (!acc[item.section]) acc[item.section] = [];
  acc[item.section].push(item);
  return acc;
}, {});

const ContactItem = ({ item }) => (
  <div className="contact-item">
    <img src={item.avatar} alt={item.name} className="avatar" />
    <div className="contact-info">
      <p className="name">{item.name}</p>
      {item.status && <p className="status">{item.status}</p>}
    </div>
  </div>
);

const Contacts = () => {
  const sections = Object.keys(groupedContacts).sort();

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <Search size={22} color="white" />
        <h1 className="header-title">Contacts</h1>
        <UserCircle size={26} color="white" />
      </div>

      {/* Content */}
      <div className="content">
        <p className="my-contact-title">My Contact</p>

        {sections.map((section) => (
          <div key={section}>
            <p className="section-header">{section}</p>
            {groupedContacts[section].map((contact) => (
              <ContactItem key={contact.id} item={contact} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <div className="nav-item">
          <MessageCircle size={22} color="gray" />
          <span>Message</span>
        </div>
        <div className="nav-item">
          <Phone size={22} color="gray" />
          <span>Calls</span>
        </div>
        <div className="nav-item active">
          <Users size={22} color="#00A884" />
          <span>Contacts</span>
        </div>
        <div className="nav-item">
          <Settings size={22} color="gray" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
