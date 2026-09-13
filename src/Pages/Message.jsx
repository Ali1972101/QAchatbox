import { useEffect, useState, useRef } from "react";
import "./Message.css";
import BottomNav from "../Components/BottomNav";
import { Search, Plus } from "lucide-react";
import { useAuth } from '../../hooks/useAuth.jsx';
import { createSocket } from '../lib/socket';
import blank from "../assets/Images/blank.png";
import { useLocation } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Message() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { token, user, setUser } = useAuth();
  const location = useLocation();
  const statusFileRef = useRef(null);

  const STORAGE_SELECTED = 'chat_selectedUser_v1';
  const STORAGE_MESSAGES = 'chat_messages_v1';

  const makeUrl = (p) => (p && p.startsWith('/') ? `${BASE}${p}` : p || null);

  const storiesData = [
    {
      id: "my-status",
      name: user?.name || "My status",
      avatar: user?.imageUrl ? makeUrl(user.imageUrl) : blank,
      borderColor: "white-ring",
      isMyStatus: true,
    },
  ];

  useEffect(() => {
    const t = token || localStorage.getItem('token');
    if (!t) return;
    const s = createSocket(t);
    socketRef.current = s;
    s.on('connect', () => console.log('socket connected'));

    s.on('private_message', (msg) => {
      // append message and persist
      setMessages((prev) => {
        const next = [...prev, msg];
        try { sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch (e) {}
        return next;
      });

      // ensure sender appears in users list
      const senderId = msg.sender || msg.from || msg.fromId;
      if (senderId) {
        // try to fetch sender details from backend if we don't already have them
        setUsers((prev) => {
          if (prev.some(u => u._id === senderId)) return prev;
          // add a temporary placeholder while we fetch the real data
          const temp = { _id: senderId, name: '', imageUrl: null, statusText: '' };
          return [temp, ...prev];
        });

        (async () => {
          try {
            const t = token || localStorage.getItem('token');
            const res = await fetch(`${BASE}/api/users/${senderId}`, { headers: t ? { Authorization: `Bearer ${t}` } : {} });
            if (res.ok) {
              const userData = await res.json();
              setUsers((prev) => {
                // replace placeholder with fetched data
                const filtered = prev.filter(u => u._id !== senderId);
                return [{ _id: userData._id || userData.id, name: userData.name, imageUrl: userData.avatarUrl || userData.imageUrl || null, statusText: userData.statusText || '' }, ...filtered];
              });

              // auto-open chat only when no chat is currently selected
              setSelectedUser((cur) => {
                if (!cur) {
                  try { sessionStorage.setItem(STORAGE_SELECTED, JSON.stringify({ _id: userData._id || userData.id, name: userData.name })); } catch (e) {}
                  return { _id: userData._id || userData.id, name: userData.name };
                }
                return cur;
              });
            } else {
              // if fetch failed, keep the temporary entry with a generic name
              setUsers((prev) => prev.map(u => u._id === senderId ? { ...u, name: 'Unknown user' } : u));
            }
          } catch (e) {
            console.warn('Could not fetch sender details', e?.message || e);
            setUsers((prev) => prev.map(u => u._id === senderId ? { ...u, name: 'Unknown user' } : u));
          }
        })();
      }
    });

    return () => { s.disconnect(); };
  }, [token]);

  useEffect(() => {
    try { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch (e) {}
  }, [messages]);

  useEffect(() => {
    const u = location?.state?.user;
    if (u) {
      openChat(u);
      return;
    }
    // restore cached state
    try {
      const storedSel = sessionStorage.getItem(STORAGE_SELECTED);
      const storedMsgs = sessionStorage.getItem(STORAGE_MESSAGES);
      let parsedMsgs = [];
      if (storedMsgs) {
        try { parsedMsgs = JSON.parse(storedMsgs); setMessages(parsedMsgs); } catch (e) { parsedMsgs = []; }
      }
      // only restore previously selected chat if there is message history for it
      if (storedSel) {
        try {
          const sel = JSON.parse(storedSel);
          const selId = sel._id || sel.id;
          const hasHistory = parsedMsgs && parsedMsgs.some(m => (m.sender === selId) || (m.receiver === selId));
          if (hasHistory) setSelectedUser(sel);
        } catch (e) { /* ignore invalid stored selection */ }
      }
    } catch (e) { /* ignore */ }
  }, [location]);

  const openChat = async (u) => {
    setSelectedUser(u);
    try { sessionStorage.setItem(STORAGE_SELECTED, JSON.stringify(u)); } catch (e) {}
    try {
      const t = token || localStorage.getItem('token');
      const res = await fetch(`${BASE}/api/message/${u._id}`, { headers: t ? { Authorization: `Bearer ${t}` } : {} });
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data || []);
      try { sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(data || [])); } catch (e) {}
    } catch (err) {
      console.error('Load messages error', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const toId = selectedUser._id;
    const tempId = `local-${Date.now()}`;
    const localMsg = { _id: tempId, sender: user?._id || user?.id, receiver: toId, message: input, createdAt: new Date().toISOString(), status: 'sending' };

    // optimistic UI update
    setMessages((prev) => {
      const next = [...prev, localMsg];
      try { sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch (e) {}
      return next;
    });
    setInput('');

    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit('private_message', { to: toId, content: localMsg.message, _tempId: tempId });
      // best-effort mark as sent
      setMessages((prev) => prev.map(m => m._id === tempId ? { ...m, status: 'sent' } : m));
    } else {
      // fallback to HTTP persist — try several possible endpoints for compatibility
      const endpoints = ['/api/messages', '/api/message', '/api/messages/send', '/api/message/send'];
      const t = token || localStorage.getItem('token');
      let delivered = false;
      const tried = [];
      for (const ep of endpoints) {
        try {
          const url = `${BASE}${ep}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
            body: JSON.stringify({ to: toId, content: localMsg.message }),
          });
          tried.push({ ep, status: res.status });
          if (res.ok) {
            delivered = true;
            setMessages((prev) => prev.map(m => m._id === tempId ? { ...m, status: 'sent' } : m));
            break;
          }
        } catch (err) {
          tried.push({ ep, status: 'error', error: err?.message || String(err) });
        }
      }
      if (!delivered) {
        console.warn('Message fallback failed; endpoints tried:', tried);
        setMessages((prev) => prev.map(m => m._id === tempId ? { ...m, status: 'failed' } : m));
      }
    }
  };

  // helper to show users (dedupe)
  const renderUsers = () => {
    const seen = new Set();
    return users.filter(u => {
      const id = u._id || u.email || JSON.stringify(u);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  return (
    <div className="mobile-screen-wrapper">
      <div className="message-container">
        <header className="message-header">
          <button className="search-btn" aria-label="Search">
            <Search size={18} color="white" />
          </button>
          <h1 className="header-title">Home</h1>
          <div className="user-profile-avatar">
            <img style={{ borderRadius: "100%", border: "2px solid white" }} src={ user?.imageUrl ? makeUrl(user.imageUrl) : blank } alt="User profile" />
          </div>
        </header>

        <div className="stories-section">
          <div className="stories-scroll">
            {storiesData.map((item, idx) => (
              <div className="story-item" key={item.id || item.name || idx}>
                <div className={`story-avatar-ring ${item.borderColor}`}>
                  <img src={item.avatar} alt={item.name} className="story-img" />
                  {item.isMyStatus && (
                    <div className="add-status-badge" onClick={() => statusFileRef.current && statusFileRef.current.click()}>
                      <Plus size={11} color="black" strokeWidth={3} />
                      <input ref={statusFileRef} type="file" accept="image/*" style={{display:'none'}} onChange={async (e)=>{
                        const file = e.target.files[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('statusImage', file);
                        form.append('statusText', '');
                        try {
                          const res = await fetch(`${BASE}/api/users/upload-status`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok) setUser(data.user);
                          else console.warn('Status upload failed', data);
                        } catch (err) { console.error(err); }
                      }} />
                    </div>
                  )}
                </div>
                <span className="story-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <main className="chat-drawer-panel">
          <div className="drawer-handle-bar" />

          <div className="chat-list">
            {renderUsers().length === 0 && messages.length === 0 && <p className="muted">No messages. Use the Contacts tab to search users.</p>}
            {renderUsers().map((u, idx) => (
              <div key={u._id || u.email || idx} className="chat-item" onClick={() => openChat(u)}>
                <div className="chat-avatar-container">
                  <img src={ makeUrl(u.imageUrl) || blank } alt={u.name} className="single-avatar" />
                </div>
                <div className="chat-info">
                  <h3 className="chat-name">{u.name}</h3>
                  <p className="chat-preview">{u.statusText}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <div className="chat-window">
              <h3>Chat with {selectedUser.name}</h3>
              <div className="messages-list">
                {(() => {
                  const seen = new Set();
                  const uniqueMessages = messages.filter((msg, i) => {
                    const id = msg._id || `${msg.sender || 'unknown'}-${i}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                  });
                  return uniqueMessages.map((m, idx) => (
                    <div key={(m._id) ? m._id : `msg-${m.sender || 'unknown'}-${idx}`} className={`message ${m.sender === user?.id || m.sender === user?._id ? 'outgoing' : 'incoming'}`}>
                      <p>{m.message || m.content}</p>
                      {m.mediaUrl && <img src={`${BASE}${m.mediaUrl}`} alt="media" style={{maxWidth:200}} />}
                    </div>
                  ));
                })()}
                <div ref={messagesEndRef} />
              </div>
              <div className="message-input">
                <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
        </main>

        <BottomNav activeTab="message" />
      </div>
    </div>
  );
}
