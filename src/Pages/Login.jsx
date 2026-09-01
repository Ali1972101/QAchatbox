import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", form);
  };

  const isFormValid = form.email && form.password;

  return (
    <div className="login-container">
      <div className="header">
        <button className="back-btn"><ArrowLeft size={24} /></button>
      </div>

      <div className="title-section">
        <h1><span className="underline-login">Log in</span> to Chatbox</h1>
        <p>Welcome back! Sign in using your social account or email to continue us</p>
      </div>

      <div className="social-buttons">
        <button className="social-btn"><FaFacebook size={24} color="#1877F2" /></button>
        <button className="social-btn"><FaGoogle size={22} /></button>
        <button className="social-btn"><FaApple size={24} color="#000" /></button>
      </div>

      <div className="divider"><span>OR</span></div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Your email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={!isFormValid} className="submit-btn">
          Log in
        </button>

        <button type="button" className="forgot-link">Forgot password?</button>
      </form>

      <div className="home-indicator"></div>
    </div>
  );
}