import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSavings } from "../context/SavingsContext";

const PHONE_REGEX = /^(\+234|0)[789]\d{9}$/;

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { setActiveUserId } = useSavings();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLocalError("");

    const loginPhone = phone.trim();

    // Validation
    if (!loginPhone || !password) {
      setLocalError("Please enter both phone and password.");
      return;
    }

    if (!PHONE_REGEX.test(loginPhone)) {
      setLocalError(
        "Please enter a valid Nigerian phone number (e.g., 08012345678).",
      );
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(loginPhone, password);
      setActiveUserId(response.user.id ?? response.user._id);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">
            Welcome back to Tree of Life Savings
          </p>
          <h1 className="dashboard-title">Login to Your Account</h1>
        </div>
      </section>

      {localError && <div className="message-box error">{localError}</div>}

      <section className="dashboard-grid">
        <article className="dashboard-card auth-card">
          <div className="card-header">
            <h2>Login</h2>
            <p className="card-meta">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                disabled={loading}
                required
              />
              <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Enter the phone number you used to sign up
              </small>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
