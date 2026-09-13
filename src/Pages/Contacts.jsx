import React, { useEffect, useState } from "react";
import "./Contact.css";
import BottomNav from "../Components/BottomNav";
import blank from "../assets/Images/blank.png";
import { Search, UserPlus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate } from 'react-router-dom';

const makeUrl = (p) => {
  if (!p) return null;
  if (p.startsWith('/')) return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${p}`;
  return p;
}

const ContactItem = ({ item, onClick }) => (
  <div className="contact-item" onClick={() => onClick && onClick(item)}>
    <img src={makeUrl(item.imageUrl) || blank} alt={item.name} className="avatar" />
    <div className="contact-info">
      <p className="name">{item.name}</p>
      {item.statusText && <p className="status">{item.statusText}</p>}
    </div>
  </div>
);

const Contacts = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query || !query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      fetchUsers(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchUsers = async (q) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = auth?.token || localStorage.getItem('token');
      const endpoint = `/api/users/search?q=${encodeURIComponent(q)}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${baseUrl}${endpoint}`, { headers });
      if (!res.ok) {
        const txt = await res.text().catch(() => ({}));
        console.warn('Search failed', res.status, txt);
        setResults([]);
      } else {
        const data = await res.json().catch(() => []);
        setResults(data || []);
      }
    } catch (err) {
      console.error('Search error', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-screen-wrapper">
      <div className="contacts-page-container">
        <div className="status-bar"></div>

        <div className="header">
          <div className="search-box">
            <Search size={18} color="white" />
            <input placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <h1 className="header-title">Contacts</h1>
          <button className="header-icon-btn" aria-label="Add Contact">
            <UserPlus size={18} color="white" />
          </button>
        </div>

        <div className="content">
          <div className="drawer-handle-bar"></div>
          <p className="my-contact-title">Search results</p>

          {loading && <p>Searching...</p>}
          {!loading && results.length === 0 && <p className="muted">No users</p>}
          {(() => {
            const seen = new Set();
            const unique = results.filter((r) => {
              const id = r._id || r.email || JSON.stringify(r);
              if (seen.has(id)) return false;
              seen.add(id);
              return true;
            });
            return unique.map((user, idx) => (
              <ContactItem key={user._id || user.email || idx} item={user} onClick={() => { 
                if (onSelect) onSelect(user); 
                navigate('/message', { state: { user } });
              }} />
            ));
          })()}
        </div>

        <BottomNav activeTab="contacts" />
      </div>
    </div>
  );
};

export default Contacts;
