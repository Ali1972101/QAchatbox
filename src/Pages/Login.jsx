import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setMessage(null);
    setLoading(true);
    const payload = { email, password };

    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000" : "");

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({ type: "success", text: "Login successful! Redirecting..." });
        if (auth && typeof auth.login === "function") {
          auth.login(data.token, data.user || null);
        } else {
          if (data.token) localStorage.setItem("token", data.token);
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        }
        setTimeout(() => {
          navigate("/message");
        }, 800);
      } else {
        setMessage({ type: "error", text: data?.message || "Signin failed" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({
        type: "error",
        text: `Network error — cannot connect to backend at ${baseUrl}. Ensure backend server is running.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="title-section">
        <h1>
          <span className="underline-login">Log in</span> to Chatbox
        </h1>
        <p>Welcome back! Sign in using your social account or email to continue</p>
      </div>

      <div className="social-buttons">
        <button type="button" className="social-btn" aria-label="Sign in with Facebook">
          <FaFacebook size={24} color="#1877F2" />
        </button>
        <button type="button" className="social-btn" aria-label="Sign in with Google">
          <FaGoogle size={22} />
        </button>
        <button type="button" className="social-btn" aria-label="Sign in with Apple">
          <FaApple size={24} color="#000" />
        </button>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      {message && (
        <div className={`auth-alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSignin} className="login-form">
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

        <button type="submit" disabled={!isFormValid || loading} className="submit-btn">
          {loading ? "Logging in..." : "Log in"}
        </button>

        <button type="button" className="forgot-link">
          Forgot password?
        </button>

        <div className="auth-footer-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>

      <div className="home-indicator"></div>
    </div>
  );
};

export default Login;