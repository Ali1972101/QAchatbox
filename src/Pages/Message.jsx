import { useEffect, useState, useRef } from "react";
import "./Message.css";
import BottomNav from "../Components/BottomNav";
import { Search, Plus } from "lucide-react";
import { useAuth } from '../../hooks/useAuth.jsx';
import { createSocket } from '../lib/socket';
import blank from "../assets/Images/blank.png";
import { useLocation, useNavigate } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Message() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [notice, setNotice] = useState(null); // { text } — transient "new message" banner
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);
  const userRef = useRef(null);
  const usersRef = useRef([]);
  const noticeTimeoutRef = useRef(null);
  const { token, user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
    // keep refs in sync so socket handler sees latest values
    selectedUserRef.current = selectedUser;
    userRef.current = user;
  }, [selectedUser, user]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Show a transient "new message" banner at the top of the screen.
  // Only ever called while this component (the chat/home screen) is
  // mounted and its socket listener is active — so it naturally only
  // fires "as long as the user is still on the chat".
  const showNotice = (text) => {
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    setNotice({ text, id: Date.now() });
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 3000);
  };

  useEffect(() => {
    const t = token || localStorage.getItem('token');
    if (!t) return;
    const s = createSocket(t);
    socketRef.current = s;
    s.on('connect', () => console.log('socket connected'));
    s.on('connect_error', (err) => console.error('socket connect_error', err && err.message ? err.message : err));

    s.on('private_message', (msg) => {
      console.debug('socket received private_message', msg);
      // determine participants for this message
      const senderId = msg.sender || msg.from || msg.fromId;
      const receiverId = msg.receiver || msg.to || msg.toId;
      const myId = userRef.current?._id || userRef.current?.id;
      const isMine = String(senderId) === String(myId);

      const curSelected = selectedUserRef.current;
      const belongsToOpenChat = curSelected && (String(curSelected._id) === String(senderId) || String(curSelected._id) === String(receiverId));

      // "new message" banner — only for messages someone ELSE sent you,
      // and only when it's outside the chat you currently have open.
      // Your own outgoing messages never trigger this: you already see
      // them appear in the chat box when you send them.
      if (!belongsToOpenChat && !isMine) {
        const previewText = msg.message || msg.content || '';
        const fromName = usersRef.current.find(u => String(u._id) === String(senderId))?.name || 'New message';
        showNotice(`${fromName}: ${previewText}`);
      }

      if (belongsToOpenChat) {
        console.debug('message belongs to open chat, appending/replacing', { senderId, receiverId, curSelected: curSelected && curSelected._id, myId });
        // append or replace optimistic message in current open chat and persist
        setMessages((prev) => {
          if (msg && msg._tempId) {
            let replaced = false;
            const next = prev.map(m => {
              if (m._id === msg._tempId) { replaced = true; return { ...msg, status: 'sent' }; }
              return m;
            });
            if (!replaced) next.push({ ...msg, status: 'sent' });
            try { sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch (e) {}
            console.debug('replaced-or-appended-with-tempid', { tempId: msg._tempId, replaced });
            return next;
          }
          const next = [...prev, msg];
          try { sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(next)); } catch (e) {}
          console.debug('appended message without tempId', msg && msg._id);
          return next;
        });
      }

      // ensure sender appears in users list and update preview/unread.
      // Skip this entirely when the "sender" is actually you — that only
      // happens because the server echoes your own sent message back to
      // you for delivery confirmation. Without this guard, that echo was
      // being treated like an incoming message and adding YOU to your own
      // contact list with an unread badge.
      if (senderId && !isMine) {
        const now = msg.createdAt || new Date().toISOString();
        setUsers((prev) => {
          const existing = prev.find(u => String(u._id) === String(senderId));
          if (existing) {
            const updated = prev.map(u => {
              if (String(u._id) !== String(senderId)) return u;
              const isActive = curSelected && (String(curSelected._id) === String(senderId));
              return { ...u, lastMessage: msg.message || msg.content || '', lastAt: now, unreadCount: isActive ? 0 : (Number(u.unreadCount || 0) + 1) };
            });
            return updated;
          }
          // add placeholder entry
          const temp = { _id: senderId, name: '', imageUrl: null, statusText: '', lastMessage: msg.message || msg.content || '', lastAt: now, unreadCount: 1 };
          return [...prev, temp];
        });

        // fetch sender details to replace placeholder
        (async () => {
          try {
            const t = token || localStorage.getItem('token');
            const res = await fetch(`${BASE}/api/users/${senderId}`, { headers: t ? { Authorization: `Bearer ${t}` } : {} });
            if (res.ok) {
              const userData = await res.json();
              setUsers((prev) => {
                const filtered = prev.filter(u => String(u._id) !== String(senderId));
                const existing = prev.find(u => String(u._id) === String(senderId)) || {};
                const merged = { _id: userData._id || userData.id, name: userData.name, imageUrl: userData.avatarUrl || userData.imageUrl || null, statusText: userData.statusText || '', lastMessage: existing.lastMessage || '', lastAt: existing.lastAt || now, unreadCount: existing.unreadCount || 0 };
                // keep the placeholder's original position instead of moving it
                const idx = prev.findIndex(u => String(u._id) === String(senderId));
                const next = [...filtered];
                if (idx === -1) next.push(merged);
                else next.splice(idx, 0, merged);
                return next;
              });
            } else {
              setUsers((prev) => prev.map(u => String(u._id) === String(senderId) ? { ...u, name: 'Unknown user' } : u));
            }
          } catch (e) {
            console.warn('Could not fetch sender details', e?.message || e);
            setUsers((prev) => prev.map(u => String(u._id) === String(senderId) ? { ...u, name: 'Unknown user' } : u));
          }
        })();
      }
    });

    // NOTE: do NOT call s.disconnect() here. socket.js hands out a single
    // shared connection; disconnecting it on every unmount (e.g. navigating
    // away from this screen, or React re-mounting in dev) was leaving the
    // module-level socket in a dead state that createSocket() kept handing
    // back on the next mount — which is why messages only ever showed up
    // after a manual refetch. Just remove this component's own listeners.
    return () => {
      s.off('connect');
      s.off('connect_error');
      s.off('private_message');
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, [token]);

  useEffect(() => {
    try { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch (e) {}
  }, [messages]);

  useEffect(() => {
    const u = location?.state?.user;
    if (u) {
      openChat(u);
      // Consume the navigation state immediately. React Router's history
      // state (unlike normal component state) survives a hard refresh, so
      // without this, refreshing after switching to a different chat would
      // keep snapping back to whichever user you originally clicked from
      // Contacts to get here.
      navigate(location.pathname, { replace: true, state: null });
      return;
    }
    // On a plain refresh (no location.state), reopen whichever chat was
    // last open, re-fetching its history fresh from the server rather
    // than trusting the cached sessionStorage snapshot — this is more
    // reliable and means a refresh never silently drops back to the list.
    try {
      const storedSel = sessionStorage.getItem(STORAGE_SELECTED);
      if (storedSel) {
        const sel = JSON.parse(storedSel);
        if (sel && (sel._id || sel.id)) {
          openChat(sel);
        }
      }
    } catch (e) { /* ignore invalid stored selection */ }
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
      // clear unread count for this user
      setUsers((prev) => prev.map(x => String(x._id) === String(u._id) ? { ...x, unreadCount: 0 } : x));
    } catch (err) {
      console.error('Load messages error', err);
    }
  };

  const closeChat = () => {
    setSelectedUser(null);
    try { sessionStorage.removeItem(STORAGE_SELECTED); } catch (e) {}
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

    // NEW: update the conversation list (home screen) immediately, since
    // we won't receive our own 'private_message' event back from the socket.
    setUsers((prev) => {
      const exists = prev.some(u => String(u._id) === String(toId));
      const updated = exists
        ? prev.map(u =>
            String(u._id) === String(toId)
              ? { ...u, lastMessage: localMsg.message, lastAt: localMsg.createdAt }
              : u
          )
        : [
            {
              _id: toId,
              name: selectedUser.name,
              imageUrl: selectedUser.imageUrl || null,
              statusText: selectedUser.statusText || '',
              lastMessage: localMsg.message,
              lastAt: localMsg.createdAt,
              unreadCount: 0,
            },
            ...prev,
          ];
      return updated;
    });

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
            body: JSON.stringify({ to: toId, content: localMsg.message, _tempId: tempId }),
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

  // helper to show users (dedupe only — list order is left as-is, not
  // resorted by recency, so conversations don't jump around).
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
        {notice && (
          <div
            className="new-message-banner"
            style={{
              position: 'fixed',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              background: 'rgba(0,0,0,0.85)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              maxWidth: '85%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {notice.text}
          </div>
        )}
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

          {!selectedUser ? (
            <div className="chat-list">
              {renderUsers().length === 0 && <p className="muted">No messages. Use the Contacts tab to search users.</p>}
              {renderUsers().map((u, idx) => (
                <div key={u._id || u.email || idx} className="chat-item" onClick={() => openChat(u)}>
                  <div className="chat-avatar-container">
                    <img src={ makeUrl(u.imageUrl) || blank } alt={u.name} className="single-avatar" />
                  </div>
                  <div className="chat-info">
                    <h3 className="chat-name">{u.name}</h3>
                    <p className="chat-preview">{u.lastMessage || u.statusText}</p>
                  </div>
                  {u.unreadCount > 0 && (
                    <span className="unread-badge">{u.unreadCount}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="chat-window">
              <div className="chat-window-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <button
                  className="back-to-messages-btn"
                  onClick={closeChat}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '4px 0' }}
                >
                  ← Messages
                </button>
                <h3 style={{ margin: 0 }}>Chat with {selectedUser.name}</h3>
              </div>
              <div className="messages-list">
                {(() => {
                  const myId = String(user?._id || user?.id || '');
                  const otherId = String(selectedUser._id);
                  // Defensive filter: only show messages that actually
                  // belong to THIS conversation (me <-> selectedUser), so
                  // messages from other pending chats can never bleed in.
                  const convoMessages = messages.filter((m) => {
                    const s = String(m.sender);
                    const r = String(m.receiver);
                    return (s === otherId && r === myId) || (s === myId && r === otherId);
                  });
                  const seen = new Set();
                  const uniqueMessages = convoMessages.filter((msg, i) => {
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
