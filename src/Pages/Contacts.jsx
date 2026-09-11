import React from "react";
import "./Contact.css";
import BottomNav from "../Components/BottomNav";
import {
  Search,
  UserPlus,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

const contactsData = [
  {
    id: "1",
    name: "Afrin Sabila",
    status: "Life is beautiful ",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    section: "A",
  },
  {
    id: "2",
    name: "Alex Linderson",
    status: "Working hard ",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    section: "A",
  },
  {
    id: "3",
    name: "Bristy Haque",
    status: "Keep working ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    section: "B",
  },
  {
    id: "4",
    name: "John Ahraham",
    status: "Available for meeting",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    section: "J",
  },
  {
    id: "5",
    name: "Sabila Sayma",
    status: "At the gym 🏋️‍♀️",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    section: "S",
  },
  {
    id: "6",
    name: "Sheik Sadi",
    status: "Busy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    section: "S",
  },
];


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
    <div className="mobile-screen-wrapper">
      <div className="contacts-page-container">
      
        <div className="status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <Signal size={15} />
            <Wifi size={15} />
            <Battery size={18} />
          </div>
        </div>

        
        <div className="header">
          <button className="header-icon-btn" aria-label="Search">
            <Search size={18} color="white" />
          </button>
          <h1 className="header-title">Contacts</h1>
          <button className="header-icon-btn" aria-label="Add Contact">
            <UserPlus size={18} color="white" />
          </button>
        </div>

        
        <div className="content">
          <div className="drawer-handle-bar"></div>
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

        
        <BottomNav activeTab="contacts" />
      </div>
    </div>
  );
};

export default Contacts;
