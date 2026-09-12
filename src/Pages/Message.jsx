import { useEffect, useState, useRef } from "react";
import "./Message.css";
import BottomNav from "../Components/BottomNav";
import { Search, Plus } from "lucide-react";
import { useAuth } from '../../hooks/useAuth.jsx';
import { createSocket } from '../lib/socket';
import blank from "../assets/Images/blank.png";
import { useLocation } from 'react-router-dom';



export default function Message() {
  const [message, setMessage] = useState(false);
  const [call, setCall] = useState(false);
  const [contact, setContact] = useState(false);
  const [setting, setSetting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const { token, user, setUser } = useAuth();
  const location = useLocation();
  const makeUrl = (p) => (p && p.startsWith('/') ? `http://localhost:5000${p}` : p || null);
  const statusFileRef = useRef(null);

  const storiesData = [
    {
      id: "my-status",
      name: user?.name || "My status",
      avatar: user?.imageUrl ? `http://localhost:5000${user.imageUrl}` : blank,
      borderColor: "white-ring",
      isMyStatus: true,
    },
  ];

  const messageMenu = () => { 
    setMessage(!message);
    if (!message) {
      setCall(false);
      setContact(false);
      setSetting(false);
    }
  };
  
  const callMenu = () => {
    setCall(!call);
    if (!call) {
      setMessage(false);
      setContact(false);
      setSetting(false);
    }
  };

  const contactMenu = () => {
    setContact(!contact);
    if (!contact) {
      setMessage(false);
      setCall(false);
      setSetting(false);
    }
  };

  const settingMenu = () => {
    setSetting(!setting);
    if (!setting) {
      setMessage(false);
      setCall(false);
      setContact(false);
    }
  };



  useEffect(()=>{
    const t = token || localStorage.getItem('token');
    if (!t) return;
    const s = createSocket(t);
    socketRef.current = s;
    s.on('connect', ()=> console.log('connected'));
    s.on('private_message', (msg)=>{
      // if message belongs to current conversation, append
      setMessages((prev)=>[...prev, msg]);
    });
    return ()=>{
      // do not disconnect globally to avoid affecting other pages
    }
  },[token]);

  // if navigated with user in location.state, open chat
  useEffect(()=>{
    const u = location?.state?.user;
    if (u) {
      // ensure user object has _id
      openChat(u);
    }
  },[location]);

  const openChat = async (u) => {
    setSelectedUser(u);
    // load messages
    try {
      const t = token || localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/message/${u._id}`, { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error('Load messages error', err);
    }
  }

  const sendMessage = async ()=>{
    if (!input.trim() || !selectedUser) return;
    const payload = { to: selectedUser._id, content: input };
    // emit socket message
    socketRef.current?.emit('private_message', payload);
    setInput('');
  }

  return (
    <div className="mobile-screen-wrapper">
      <div className="message-container">
        
        

        
        <header className="message-header">
          <button className="search-btn" aria-label="Search">
            <Search size={18} color="white" />
          </button>
          <h1 className="header-title">Home</h1>
          <div className="user-profile-avatar">
            <img style={{borderRadius:"100%", border:"2px solid white"}}
              src={ user?.imageUrl ? makeUrl(user.imageUrl) : blank }
              alt="User profile"
            />
          </div>
        </header>

        {/* Stories / Status Row */}
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
                          const res = await fetch('http://localhost:5000/api/users/upload-status', {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setUser(data.user);
                          } else {
                            console.warn('Status upload failed', data);
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }} />
                    </div>
                  )}
                </div>
                <span className="story-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* White Drawer Main Panel */}
        <main className="chat-drawer-panel">
          <div className="drawer-handle-bar"></div>

          <div className="chat-list">
            {users.length === 0 && <p className="muted">No messages. Use the Contacts tab to search users.</p>}
            {users.map((u, idx) => (
              <div key={u._id || u.email || idx} className="chat-item" onClick={() => openChat(u)}>
                <div className="chat-avatar-container">
                  <img src={makeUrl(u.imageUrl) || blank} alt={u.name} className="single-avatar" />
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
                {messages.map((m, idx)=> (
                  <div key={(m._id) ? m._id : `msg-${m.sender || 'unknown'}-${idx}`} className={`message ${m.sender === user?.id || m.sender === user?._id ? 'outgoing' : 'incoming'}`}>
                    <p>{m.message}</p>
                    {m.mediaUrl && <img src={`http://localhost:5000${m.mediaUrl}`} alt="media" style={{maxWidth:200}} />}
                  </div>
                ))}
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