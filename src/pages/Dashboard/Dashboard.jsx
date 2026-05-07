import { useSavings } from "../../context/SavingsContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Dashboard() {
  const { users, ready, activeUserId } = useSavings();
  const navigate = useNavigate();

  if (!ready) return <p>Loading savings data...</p>;

  const currentUser = users.find((u) => u.id === activeUserId);

  if (!currentUser) return <p>User not found</p>;

  const { transactions, walletBalance, currentCycle } = currentUser;
  const activeCycle = currentCycle?.status === "active" ? currentCycle : null;

  const cycleBalance = activeCycle
    ? activeCycle.dailyAmount * activeCycle.daysPaid - activeCycle.totalCharges
    : 0;

  const totalBalance = walletBalance + cycleBalance;

  const progress = activeCycle?.totalDays
    ? (activeCycle.daysPaid / activeCycle.totalDays) * 100
    : 0;

  const recentTransactions = transactions.slice(0, 4);

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Welcome back, {currentUser.name}</p>
          <h1 className="dashboard-title">Savings dashboard</h1>
        </div>

        <div className="dashboard-balance-card">
          <span>Total balance</span>
          <strong>₦{formatCurrency(totalBalance)}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-title">Wallet balance</div>
          <div className="card-value">₦{formatCurrency(walletBalance)}</div>
          <p className="card-meta">
            Available funds for withdrawal and transfers.
          </p>
        </article>

        <article className="dashboard-card">
          <div className="card-title">Cycle progress</div>
          <div className="card-value">₦{formatCurrency(cycleBalance)}</div>
          {activeCycle ? (
            <div className="dashboard-progress">
              <div className="progress-label">
                <span>
                  {activeCycle.daysPaid} / {activeCycle.totalDays} days
                </span>
                <strong>{progress.toFixed(0)}%</strong>
              </div>
              <div className="progress-wrapper">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="empty-state">No active savings cycle yet.</p>
          )}
        </article>

        <article className="dashboard-card">
          <div className="card-title">Current goal</div>
          <div className="card-value">
            {activeCycle
              ? `₦${formatCurrency(activeCycle.dailyAmount * activeCycle.totalDays)}`
              : "No active cycle"}
          </div>
          <p className="card-meta">
            {activeCycle
              ? `${activeCycle.totalDays - activeCycle.daysPaid} days remaining`
              : "Start a new cycle to begin saving."}
          </p>
        </article>
      </section>

      <section className="dashboard-actions">
        {!activeCycle && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/setup")}
          >
            Start New Cycle
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/savings")}
        >
          Save Today
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/withdraw")}
        >
          Withdraw
        </button>
      </section>

      <section className="dashboard-card dashboard-activity">
        <div className="card-header">
          <div>
            <h2>Recent activity</h2>
            <p className="card-meta">
              Latest transactions from your savings cycle.
            </p>
          </div>
          <span>{transactions.length} items</span>
        </div>

        {recentTransactions.length > 0 ? (
          <ul className="transaction-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <p className="transaction-title">
                    {transaction.type === "deposit"
                      ? "Saved"
                      : transaction.type === "withdrawal"
                        ? "Withdrawn"
                        : transaction.type}
                  </p>
                  <p className="transaction-meta">
                    {transaction.source} •{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="transaction-amount">
                  ₦{formatCurrency(transaction.amount)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No recent activity available yet.</p>
        )}
      </section>
    </main>
  );
}
