import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT */}

      <div className="auth-left">
        <div className="auth-brand">
          <h1>Save Better With KoloPay.</h1>

          <p>
            Save securely, automate your financial goals, and grow your money
            with confidence.
          </p>

          <div className="auth-features">
            <div className="auth-feature">✅ Automated savings tracking</div>

            <div className="auth-feature">
              ✅ Secure wallet & withdrawal system
            </div>

            <div className="auth-feature">✅ Transparent financial ledger</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back</h2>

          <p>Login to your savings account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-input-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                className="auth-input"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
