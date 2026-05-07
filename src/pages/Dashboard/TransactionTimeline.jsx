import { useSavings } from "../../context/SavingsContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function TransactionTimeline() {
  const { transactions } = useSavings();

  const getColor = (type) => {
    if (type === "deposit") return "#16a34a";
    if (type === "withdrawal") return "#dc2626";
    return "#f59e0b";
  };

  return (
    <div style={styles.container}>
      <h3>Transaction History</h3>

      {transactions.length === 0 && (
        <p>No transactions yet</p>
      )}

      {transactions.map((t) => (
        <div key={t.id} style={styles.item}>
          <div>
            <p style={{ margin: 0 }}>
              {t.type.toUpperCase()}
            </p>
            <small style={{ color: "#666" }}>
              {new Date(t.date).toLocaleString()}
            </small>
          </div>

          <div style={{ color: getColor(t.type), fontWeight: "bold" }}>
            {t.effect > 0 ? "+" : ""}
            ₦{formatCurrency(t.effect)}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
};