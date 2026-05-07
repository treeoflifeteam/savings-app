import { useSavings } from "../context/SavingsContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function History() {
  const { users, activeUserId } = useSavings();

  const user = users.find((u) => u.id === activeUserId);

  if (!user) return <p>Loading...</p>;

  const transactions = user.transactions || [];
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCharges = transactions
    .filter((t) => t.type === "charge")
    .reduce((sum, t) => sum + t.amount, 0);

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

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Your finances</p>
          <h1 className="dashboard-title">Transaction History</h1>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-title">Total Deposited</div>
          <div className="card-value">₦{formatCurrency(totalDeposits)}</div>
          <p className="card-meta">All deposits and savings</p>
        </article>

        <article className="dashboard-card">
          <div className="card-title">Total Charges</div>
          <div className="card-value">₦{formatCurrency(totalCharges)}</div>
          <p className="card-meta">Fees and charges deducted</p>
        </article>
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet</p>
        ) : (
          <ul className="transaction-list">
            {transactions.slice(0, 20).map((t) => (
              <li key={t.id} className="transaction-item">
                <div className="transaction-left">
                  <p className="transaction-title">
                    {getTransactionIcon(t.type)} {getTransactionLabel(t.type)}
                  </p>
                  <p className="transaction-meta">
                    {new Date(t.date).toLocaleString()}
                  </p>
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
