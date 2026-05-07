import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSavings } from "../context/SavingsContext";

const PHONE_REGEX = /^(\+234|0)[789]\d{9}$/;

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { setActiveUserId } = useSavings();
  const navigate = useNavigate();

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    resetMessages();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // Validation
    if (!trimmedName || !trimmedPhone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
      setError(
        "Please enter a valid Nigerian phone number (e.g., 08012345678).",
      );
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError(
        "Password must include at least one uppercase letter, one lowercase letter, and one number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await register(trimmedName, trimmedPhone, password);

      setMessage("Account created successfully! Redirecting to dashboard...");

      setTimeout(() => {
        setActiveUserId(response.user.id ?? response.user._id);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.message || err || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Welcome to Tree of Life Savings</p>
          <h1 className="dashboard-title">Create Your Account</h1>
        </div>
      </section>

      {message && <div className="message-box success">{message}</div>}
      {error && <div className="message-box error">{error}</div>}

      <section className="dashboard-grid">
        <article className="dashboard-card auth-card">
          <div className="card-header">
            <h2>Sign Up</h2>
            <p className="card-meta">Join our cooperative savings community</p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ada Nwachukwu"
                disabled={loading}
                required
              />
            </div>

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
                Enter your Nigerian phone number
              </small>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <Link to="/" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
