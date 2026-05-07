import { useSavings } from "../../context/SavingsContext";

export default function Insights() {
  const { currentCycle, transactions } = useSavings();

  if (!currentCycle) return null;

  const thisWeekSavings = transactions
    .filter((t) => {
      const date = new Date(t.date);
      const now = new Date();
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff <= 7 && t.type === "deposit";
    })
    .reduce((sum, t) => sum + t.effect, 0);

  const progress =
    (currentCycle.daysPaid / currentCycle.totalDays) * 100;

  return (
    <div style={styles.container}>
      <h3>Insights</h3>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p>This Week</p>
          <h4>₦{thisWeekSavings}</h4>
        </div>

        <div style={styles.card}>
          <p>Progress</p>
          <h4>{progress.toFixed(0)}%</h4>
        </div>

        <div style={styles.card}>
          <p>Status</p>
          <h4>
            {progress > 50 ? "On Track 🚀" : "Getting Started"}
          </h4>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  card: {
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
  },
};