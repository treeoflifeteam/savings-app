import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSavings } from "../context/SavingsContext";
import { formatCurrency } from "../utils/formatCurrency";

const PHONE_REGEX = /^\d{10,15}$/;

export default function AdminUsers() {
  const { users, createUser, adminStartCycle, refreshAllUsers } = useSavings();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dailyAmount, setDailyAmount] = useState(1000);
  const [totalDays, setTotalDays] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    refreshAllUsers();
  }, [refreshAllUsers]);

  useEffect(() => {
    if (!selectedUser) return;
    const refreshed = users.find((user) => user.id === selectedUser.id);
    if (refreshed) setSelectedUser(refreshed);
  }, [users, selectedUser]);

  const resetFlash = () => {
    setMessage("");
    setError("");
  };

  const handleCreateUser = async () => {
    resetFlash();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Please provide a name and phone number.");
      return;
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
      setError("Phone number must contain 10 to 15 digits.");
      return;
    }

    if (users.some((user) => user.phone === trimmedPhone)) {
      setError("This phone number is already registered.");
      return;
    }

    try {
      await createUser(trimmedName, trimmedPhone);
      setName("");
      setPhone("");
      setMessage("New user created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  const handleStartCycle = async () => {
    resetFlash();

    if (!selectedUser) {
      setError("Select a user first.");
      return;
    }

    if (selectedUser.currentCycle?.status === "active") {
      setError("This user already has an active cycle.");
      return;
    }

    if (dailyAmount <= 0 || totalDays <= 0) {
      setError("Daily amount and total days must be greater than zero.");
      return;
    }

    try {
      await adminStartCycle(selectedUser.id, dailyAmount, totalDays);
      setMessage(`Savings cycle started for ${selectedUser.name}.`);
    } catch (err) {
      setError(err.message || "Failed to start cycle");
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Admin panel</p>
          <h1 className="dashboard-title">User Management</h1>
        </div>
      </section>

      <section className="dashboard-actions">
        <Link to="/admin-dashboard" className="btn btn-secondary">
          User Dashboard
        </Link>
        <Link to="/admin-reports" className="btn btn-secondary">
          View Reports
        </Link>
      </section>

      {message && <div className="message-box success">{message}</div>}
      {error && <div className="message-box error">{error}</div>}

      <section className="dashboard-grid admin-users-grid">
        <article className="dashboard-card admin-card">
          <div className="card-header">
            <h2>Create New User</h2>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ada Nwachukwu"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
            />
          </div>

          <button className="btn btn-primary" onClick={handleCreateUser}>
            Create User
          </button>
        </article>

        <article className="dashboard-card admin-card">
          <div className="card-header">
            <h2>Users</h2>
            <p className="card-meta">Select a user to assign a savings cycle</p>
          </div>

          <div className="admin-user-list">
            {users.length === 0 ? (
              <p className="empty-state">No users available.</p>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  className={`user-list-item ${selectedUser?.id === user.id ? "selected" : ""}`}
                  onClick={() => {
                    resetFlash();
                    setSelectedUser(user);
                  }}
                >
                  <div>
                    <p>{user.name}</p>
                    <small>{user.phone}</small>
                  </div>
                  <span>{formatCurrency(user.walletBalance)}</span>
                </button>
              ))
            )}
          </div>
        </article>

        {selectedUser && (
          <article className="dashboard-card admin-card user-detail-card">
            <div className="card-header">
              <h2>{selectedUser.name}</h2>
              <p className="card-meta">{selectedUser.phone}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Wallet Balance</span>
                <strong>₦{formatCurrency(selectedUser.walletBalance)}</strong>
              </div>
              <div className="detail-item">
                <span>Active Cycle</span>
                <strong>
                  {selectedUser.currentCycle
                    ? selectedUser.currentCycle.status
                    : "None"}
                </strong>
              </div>
              <div className="detail-item">
                <span>Completed Cycles</span>
                <strong>{selectedUser.cycles?.length || 0}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Daily Amount</label>
              <input
                type="number"
                min="100"
                value={dailyAmount}
                onChange={(e) => setDailyAmount(Number(e.target.value))}
                placeholder="1000"
              />
            </div>

            <div className="form-group">
              <label>Total Days</label>
              <input
                type="number"
                min="1"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                placeholder="30"
              />
            </div>

            <button className="btn btn-primary" onClick={handleStartCycle}>
              Start Savings Cycle
            </button>

            {selectedUser.currentCycle && (
              <div className="cycle-summary">
                <h3>Current Cycle</h3>
                <div className="summary-item">
                  <span>Daily amount</span>
                  <strong>
                    ₦{formatCurrency(selectedUser.currentCycle.dailyAmount)}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Progress</span>
                  <strong>
                    {selectedUser.currentCycle.daysPaid}/
                    {selectedUser.currentCycle.totalDays} days
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Status</span>
                  <strong>{selectedUser.currentCycle.status}</strong>
                </div>
              </div>
            )}
          </article>
        )}
      </section>
    </main>
  );
}
