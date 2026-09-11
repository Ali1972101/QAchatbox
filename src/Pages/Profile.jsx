import React from 'react'
import { ArrowLeft, MessageCircle, Video, Phone, MoreHorizontal } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const user = {
    name: "Jhon Abraham",
    username: "@jhonabraham",
    email: "jhonabraham20@gmail.com",
    address: "33 street west subidbazar,sylhet",
    phone: "(320) 555-0104",
    avatar: "https://i.pravatar.cc/200?img=12" 
  }

  return (
    <div className="profile-container">
      
      {/* Top Dark Section */}
      <div className="profile-header">
        <ArrowLeft size={24} className="back-icon" onClick={() => window.history.back()} />
        
        <div className="avatar-wrapper">
          <img src={user.avatar} alt="profile" className="avatar" />
        </div>

        <h2 className="name">{user.name}</h2>
        <p className="username">{user.username}</p>

        {/* Action Buttons */}
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

      {/* Bottom White Card */}
      <div className="profile-card">
        <div className="card-handle"></div>

        <div className="info-item">
          <p className="label">Display Name</p>
          <p className="value">{user.name}</p>
        </div>

        <div className="info-item">
          <p className="label">Email Address</p>
          <p className="value">{user.email}</p>
        </div>

        <div className="info-item">
          <p className="label">Address</p>
          <p className="value">{user.address}</p>
        </div>

        <div className="info-item">
          <p className="label">Phone Number</p>
          <p className="value">{user.phone}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile