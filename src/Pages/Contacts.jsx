import React, { useEffect, useRef, useState } from "react";
import "./Contact.css";
import BottomNav from "../Components/BottomNav";
import blank from "../assets/Images/blank.png";
import { Search, UserPlus, X } from "lucide-react";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
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

  // Focus the input as soon as the search bar opens.
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

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

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="mobile-screen-wrapper">
      <div className="contacts-page-container">
        <div className="status-bar"></div>

        <div className="header">
          {searchOpen ? (
            <div className="search-box search-box-active" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <Search size={18} color="white" />
              <input
                ref={searchInputRef}
                placeholder="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') closeSearch(); }}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white' }}
              />
              <button
                className="header-icon-btn"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <X size={18} color="white" />
              </button>
            </div>
          ) : (
            <>
              <button
                className="header-icon-btn"
                aria-label="Search"
                onClick={openSearch}
              >
                <Search size={18} color="white" />
              </button>
              <h1 className="header-title">Contacts</h1>
              <button className="header-icon-btn" aria-label="Add Contact">
                <UserPlus size={18} color="white" />
              </button>
            </>
          )}
        </div>

        <div className="content">
          <div className="drawer-handle-bar"></div>

          {!searchOpen ? (
            <p className="muted">Tap the search icon above to find people to message.</p>
          ) : (
            <>
              <p className="my-contact-title">Search results</p>

              {loading && <p>Searching...</p>}
              {!loading && query.trim() && results.length === 0 && <p className="muted">No users</p>}
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
            </>
          )}
        </div>

        <BottomNav activeTab="contacts" />
      </div>
    </div>
  );
};

export default Contacts;
