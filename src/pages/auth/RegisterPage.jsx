import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
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
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT */}

      <div className="auth-left">
        <div className="auth-brand">
          <h1>Start Building Better Savings Habits.</h1>

          <p>
            Join thousands of users building consistent saving culture through
            automation and accountability.
          </p>

          <div className="auth-features">
            <div className="auth-feature">✅ Flexible savings cycles</div>

            <div className="auth-feature">✅ Secure bank withdrawals</div>

            <div className="auth-feature">
              ✅ Trusted fintech infrastructure
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>

          <p>Start your savings journey today</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                className="auth-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                className="auth-input"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleChange}
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
              />
            </div>

            <button className="auth-btn">Create Account</button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
