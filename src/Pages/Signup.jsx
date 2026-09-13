import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Signup.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const passwordsMatch = password === confirmPassword;
  const isNameValid = name.trim().length >= 3;
  const isEmailValid = /\S+@\S+\.\S+/.test(email.trim());
  const isPasswordValid = password.length >= 6;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && passwordsMatch;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setMessage(null);
    setLoading(true);
    const payload = { name: name.trim(), email: email.trim().toLowerCase(), password };

    
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resinfo = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage({ type: "success", text: "Signup successful! Redirecting..." });
        
        if (resinfo.token && typeof auth?.login === "function") {
          auth.login(resinfo.token, resinfo.user);
          setTimeout(() => navigate("/message"), 800);
        } else {
          setTimeout(() => navigate("/login"), 800); 
        }
      } else {
        console.warn("Signup failed", response.status, resinfo);
        setMessage({
          type: "error",
          text: resinfo?.message || `Signup failed (status ${response.status})`,
        });
      }
    } catch (err) {
      console.error("Signup network error:", err);
      setMessage({
        type: "error",
        text: "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="title-section">
        <h1>
          Sign up with <span className="underline-email">Email</span>
        </h1>
        <p>
          Get chatting with friends and family today by signing up for our chat
          app!
        </p>
      </div>

      {message && (
        <div
          className={`auth-alert alert-${
            typeof message === "object" ? message.type : "error"
          }`}
        >
          {typeof message === "object" ? message.text : message}
        </div>
      )}

      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-group">
          <label>Your name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Your email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="must be up to 6 digits"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-btn"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <span className="error-hint">Passwords do not match</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="submit-btn"
        >
          {loading ? "Creating account..." : "Create an account"}
        </button>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>

      <div className="home-indicator"></div>
    </div>
  );
}
