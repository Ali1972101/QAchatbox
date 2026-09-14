import React, { useState } from 'react'
import { ArrowLeft, MessageCircle, Video, Phone, MoreHorizontal, Plus } from 'lucide-react'
import { useRef } from 'react'
import blank from "../assets/Images/blank.png";
import './Profile.css'
import { useAuth } from '../../hooks/useAuth'

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);
  const [statusText, setStatusText] = useState(user?.statusText || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  }

  const uploadImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', imageFile);
      form.append('avatar', imageFile);

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
        console.warn('image upload failed', data);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  const uploadStatus = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append('statusText', statusText);
      const res = await fetch('http://localhost:5000/api/users/upload-status', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` },
        body: form,
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <ArrowLeft size={24} className="back-icon" onClick={() => window.history.back()} />
        <div className="avatar-wrapper">
          <div className="profile-img-wrapper">
            <img src={user?.imageUrl ? `http://localhost:5000${user.imageUrl}` : blank} alt="profile" className="avatar" />
            <button className="add-image-badge" aria-label="Add image" onClick={() => fileRef.current && fileRef.current.click()}>
              <Plus size={14} color="#24786D" />
            </button>
          </div>
        </div>

        <h2 className="name">{user?.name || 'Your name'}</h2>
        <p className="username">{user?.email || ''}</p>

        <div className="action-buttons">
          <div className="action-btn">
            <MessageCircle size={22} />
          </div>
          <div className="action-btn">
            <Video size={22} />
          </div>
          <div className="action-btn">
            <Phone size={22} />
          </div>
          <div className="action-btn">
            <MoreHorizontal size={22} />
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="card-handle"></div>

        <div className="info-item">
          <p className="label">Display Name</p>
          <p className="value">{user?.name}</p>
        </div>

        <div className="info-item">
          <p className="label">Email Address</p>
          <p className="value">{user?.email}</p>
        </div>

        <div className="info-item">
          <p className="label">Update Image</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={uploadImage} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        </div>

        <div className="info-item">
          <p className="label">Status</p>
          <textarea value={statusText} onChange={(e) => setStatusText(e.target.value)} maxLength={280} />
          <button onClick={uploadStatus} disabled={loading}>{loading ? 'Updating...' : 'Update Status'}</button>
        </div>
      </div>
    </div>
  )
}

export default Profile