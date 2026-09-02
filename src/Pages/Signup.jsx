import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import "./Signup.css";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  const isFormValid =
    form.name && form.email && form.password && form.password === form.confirmPassword;

  return (
    <div className="signup-container">
      <div className="header">
        <button className="back-btn"><ArrowLeft onClick={() => window.history.back()} size={24} /></button>
      </div>

      <div className="title-section">
        <h1>
          Sign up with <span className="underline-email">Email</span>
        </h1>
        <p>Get chatting with friends and family today by signing up for our chat app!</p>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <label>Your name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>

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

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-btn">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={!isFormValid} className="submit-btn">
          Create an account
        </button>
      </form>

      <div className="home-indicator"></div>
    </div>
  );
}