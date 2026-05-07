import { useSavings } from "../context/SavingsContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function TransactionHistory() {
  const { users, activeUserId } = useSavings();

  const user = users.find((u) => u.id === activeUserId);

  if (!user) return <p>Loading...</p>;

  const transactions = user.transactions || [];

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return "💰";
      case "charge":
        return "💸";
      case "withdrawal":
        return "🏦";
      default:
        return "📊";
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "charge":
        return "Charges";
      case "withdrawal":
        return "Withdrawal";
      default:
        return "Transaction";
    }
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case "app":
        return "App";
      case "manual":
        return "Manual";
      case "wallet":
        return "Wallet";
      case "cycle":
        return "Cycle";
      default:
        return source || "Direct";
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Track your activity</p>
          <h1 className="dashboard-title">Transaction History</h1>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <h2>All Transactions</h2>
          <span className="badge">{transactions.length}</span>
        </div>

        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((t) => (
              <li key={t.id} className="transaction-item">
                <div className="transaction-left">
                  <p className="transaction-title">
                    {getTransactionIcon(t.type)} {getTransactionLabel(t.type)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <p className="transaction-meta">
                      {new Date(t.date).toLocaleString()}
                    </p>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        background: "#f3f4f6",
                        color: "#6b7280",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {getSourceBadge(t.source)}
                    </span>
                  </div>
                </div>
                <div
                  className="transaction-amount"
                  style={{
                    color: t.effect > 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {t.effect > 0 ? "+" : ""}₦{formatCurrency(Math.abs(t.effect))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
