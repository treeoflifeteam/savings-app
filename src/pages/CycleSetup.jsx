import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavings } from "../context/SavingsContext";

export default function CycleSetup() {
  const [dailyAmount, setDailyAmount] = useState("");
  const [totalDays, setTotalDays] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { users, startNewCycle, activeUserId, ready } = useSavings();
  const navigate = useNavigate();

  const currentUser = useMemo(
    () => users.find((u) => u.id === activeUserId) ?? null,
    [users, activeUserId],
  );

  useEffect(() => {
    if (!ready) return;
    if (currentUser?.currentCycle) {
      navigate("/dashboard");
    }
  }, [currentUser?.currentCycle, navigate, ready]);

  const handleStart = async () => {
    setError("");

    if (!dailyAmount || Number(dailyAmount) <= 0) {
      setError("Please enter a valid daily amount");
      return;
    }

    if (!totalDays || Number(totalDays) <= 0) {
      setError("Please enter a valid number of days");
      return;
    }

    setLoading(true);
    try {
      await startNewCycle(activeUserId, Number(dailyAmount), Number(totalDays));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to start cycle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Set up your savings</p>
          <h1 className="dashboard-title">Start New Savings Cycle</h1>
        </div>
      </section>

      <section className="dashboard-card">
        <p className="card-meta">
          Choose how much you want to save daily and for how many days.
        </p>

        {error && <div className="message-box error">{error}</div>}

        <div className="form-group">
          <label>Daily Contribution (₦)</label>
          <input
            type="number"
            value={dailyAmount}
            onChange={(e) => setDailyAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>Number of Days</label>
          <input
            type="number"
            value={totalDays}
            min="1"
            onChange={(e) => setTotalDays(e.target.value)}
            placeholder="30"
          />
        </div>

        <div className="cycle-summary">
          <div className="summary-item">
            <span>Daily Amount</span>
            <strong>₦{dailyAmount || 0}</strong>
          </div>
          <div className="summary-item">
            <span>Total Days</span>
            <strong>{totalDays}</strong>
          </div>
          <div className="summary-item">
            <span>Total Target</span>
            <strong>
              ₦
              {dailyAmount && totalDays
                ? Number(dailyAmount) * Number(totalDays)
                : 0}
            </strong>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleStart}
          disabled={!dailyAmount || !totalDays || loading}
        >
          {loading ? "Starting..." : "Start Cycle"}
        </button>
      </section>
    </main>
  );
}
