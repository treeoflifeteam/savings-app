import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSavings } from "../context/SavingsContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function AdminDashboard() {
  const { users, adminAddSavings, adminWithdraw, refreshAllUsers } =
    useSavings();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [days, setDays] = useState(1);
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    refreshAllUsers();
  }, [refreshAllUsers]);

  useEffect(() => {
    if (!selectedUser) return;
    const refreshed = users.find((u) => u.id === selectedUser.id);
    if (refreshed) setSelectedUser(refreshed);
  }, [users, selectedUser]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search),
  );

  const getCycleBalance = (user) => {
    if (!user.currentCycle) return 0;
    return user.transactions.reduce((sum, t) => sum + t.effect, 0);
  };

  const handleAddSavings = async () => {
    if (!selectedUser || !days || days < 1) {
      setSuccessMessage("Please select a user and enter valid days");
      return;
    }

    const cycle = selectedUser.currentCycle;
    if (!cycle) {
      setSuccessMessage("User has no active savings cycle");
      return;
    }

    const remainingDays = cycle.totalDays - cycle.daysPaid;
    if (days > remainingDays) {
      setSuccessMessage(`Only ${remainingDays} days remaining in cycle`);
      return;
    }

    try {
      await adminAddSavings(selectedUser.id, Number(days), "manual");
      setSuccessMessage(`Added ${days} days savings for ${selectedUser.name}`);
      setDays(1);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage(err.message || "Failed to add savings");
    }
  };

  const handleWithdraw = async () => {
    if (!selectedUser || !amount || amount <= 0) {
      setSuccessMessage("Please enter a valid withdrawal amount");
      return;
    }

    const totalBalance =
      selectedUser.walletBalance + getCycleBalance(selectedUser);
    if (Number(amount) > totalBalance) {
      setSuccessMessage("Insufficient balance for withdrawal");
      return;
    }

    try {
      await adminWithdraw(selectedUser.id, Number(amount));
      setSuccessMessage(`Withdrew ₦${amount} for ${selectedUser.name}`);
      setAmount("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage(err.message || "Withdrawal failed");
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Admin panel</p>
          <h1 className="dashboard-title">User Management Dashboard</h1>
        </div>
      </section>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <section className="dashboard-actions">
        <Link to="/admin-users" className="btn btn-secondary">
          Manage Users
        </Link>
        <Link to="/admin-reports" className="btn btn-secondary">
          View Reports
        </Link>
      </section>

      <section className="dashboard-grid admin-layout">
        {/* USER LIST */}
        <article className="dashboard-card user-list-section">
          <div className="card-header">
            <h2>Users ({filteredUsers.length})</h2>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p className="empty-state">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`user-card ${selectedUser?.id === user.id ? "selected" : ""}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-phone">{user.phone}</p>
                  </div>
                  <div className="user-balance">
                    ₦
                    {formatCurrency(user.walletBalance + getCycleBalance(user))}
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        {/* USER DETAILS PANEL */}
        <article className="dashboard-card user-details-section">
          {!selectedUser ? (
            <div className="empty-state-panel">
              <h3>Select a user to manage</h3>
              <p>
                Choose a user from the list to view details and perform actions
              </p>
            </div>
          ) : (
            <>
              <div className="card-header">
                <div>
                  <h2>{selectedUser.name}</h2>
                  <p className="card-meta">{selectedUser.phone}</p>
                </div>
              </div>

              {/* BALANCE OVERVIEW */}
              <div className="balance-overview">
                <div className="balance-item">
                  <span className="balance-label">Wallet Balance</span>
                  <strong className="balance-amount">
                    ₦{formatCurrency(selectedUser.walletBalance)}
                  </strong>
                  <p className="balance-desc">Available for withdrawal</p>
                </div>

                <div className="balance-item">
                  <span className="balance-label">Cycle Balance</span>
                  <strong className="balance-amount">
                    ₦{formatCurrency(getCycleBalance(selectedUser))}
                  </strong>
                  <p className="balance-desc">
                    {selectedUser.currentCycle
                      ? `${selectedUser.currentCycle.daysPaid}/${selectedUser.currentCycle.totalDays} days completed`
                      : "No active cycle"}
                  </p>
                </div>

                <div className="balance-item total">
                  <span className="balance-label">Total Balance</span>
                  <strong className="balance-amount total-amount">
                    ₦
                    {formatCurrency(
                      selectedUser.walletBalance +
                        getCycleBalance(selectedUser),
                    )}
                  </strong>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="admin-actions">
                {/* ADD SAVINGS */}
                <div className="action-section">
                  <h3>Add Savings</h3>
                  <p className="action-desc">
                    Add days to user's active savings cycle
                  </p>

                  <div className="form-group">
                    <label>Number of Days</label>
                    <input
                      type="number"
                      min="1"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      placeholder="1"
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleAddSavings}
                  >
                    Add Savings
                  </button>
                </div>

                {/* WITHDRAW */}
                <div className="action-section">
                  <h3>Process Withdrawal</h3>
                  <p className="action-desc">
                    Withdraw funds from user's account
                  </p>

                  <div className="form-group">
                    <label>Amount (₦)</label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={handleWithdraw}
                  >
                    Process Withdrawal
                  </button>
                </div>
              </div>

              {/* RECENT TRANSACTIONS */}
              <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                {selectedUser.transactions?.length > 0 ? (
                  <ul className="transaction-list">
                    {selectedUser.transactions
                      .slice(0, 5)
                      .map((transaction) => (
                        <li key={transaction.id}>
                          <div className="transaction-left">
                            <p className="transaction-title">
                              {transaction.type === "deposit"
                                ? "Saved"
                                : transaction.type === "withdrawal"
                                  ? "Withdrawn"
                                  : transaction.type === "charge"
                                    ? "Charge"
                                    : transaction.type}
                            </p>
                            <p className="transaction-meta">
                              {transaction.source} •{" "}
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div
                            className={`transaction-amount ${transaction.effect < 0 ? "negative" : ""}`}
                          >
                            {transaction.effect < 0 ? "-" : "+"}₦
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="empty-state">No transactions yet</p>
                )}
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

function getCycleBalance(user) {
  if (!user.currentCycle) return 0;

  return user.transactions.reduce((sum, t) => sum + t.effect, 0);
}
