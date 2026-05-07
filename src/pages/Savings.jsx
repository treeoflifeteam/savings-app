import { useState } from "react";
import { useSavings } from "../context/SavingsContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import PaystackPayment from "../components/PaystackPayment";

export default function Savings() {
  const { users, addSavings, activeUserId } = useSavings();
  const navigate = useNavigate();

  const currentUser = users.find((u) => u.id === activeUserId);

  if (!currentUser) return <p>Loading...</p>;

  const cycle = currentUser.currentCycle;

  if (!cycle) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-subtitle">Get started</p>
            <h1 className="dashboard-title">No Active Cycle</h1>
          </div>
        </section>
        <section className="dashboard-card" style={{ maxWidth: "500px" }}>
          <p className="card-meta">
            You don't have an active savings cycle yet.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/setup")}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Start New Cycle
          </button>
        </section>
      </main>
    );
  }

  if (cycle.status === "completed") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-subtitle">Congratulations!</p>
            <h1 className="dashboard-title">🎉 Cycle Completed</h1>
          </div>
        </section>
        <section className="dashboard-card" style={{ maxWidth: "500px" }}>
          <p className="card-meta">
            Your savings cycle has been completed and transferred to your
            wallet.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/setup")}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Start New Cycle
          </button>
        </section>
      </main>
    );
  }

  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("manual"); // "manual" or "paystack"

  const remainingDays = cycle.totalDays - cycle.daysPaid;
  const totalAmount = cycle.dailyAmount * days;
  const firstCharge = cycle.chargesTaken
    ? 0
    : paymentMethod === "manual"
      ? cycle.dailyAmount
      : cycle.dailyAmount * 0.5;
  const paymentFee = paymentMethod === "paystack" ? totalAmount * 0.015 : 0;
  const netSavings = totalAmount - firstCharge - paymentFee;

  const handleSave = async () => {
    setError("");

    if (days < 1) {
      setError("Enter at least 1 day");
      return;
    }

    if (days > remainingDays) {
      setError(`Only ${remainingDays} days remaining`);
      return;
    }

    setLoading(true);
    try {
      await addSavings(days, "manual");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to add savings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Add to your savings</p>
          <h1 className="dashboard-title">Make Savings</h1>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-title">Daily Amount</div>
          <div className="card-value">₦{formatCurrency(cycle.dailyAmount)}</div>
          <p className="card-meta">Amount required per day.</p>
        </article>

        <article className="dashboard-card">
          <div className="card-title">Cycle progress</div>
          <div className="card-value">
            {cycle.daysPaid}/{cycle.totalDays}
          </div>
          <p className="card-meta">{remainingDays} days remaining</p>
        </article>

        <article className="dashboard-card">
          <div className="card-title">Cycle target</div>
          <div className="card-value">
            ₦{formatCurrency(cycle.dailyAmount * cycle.totalDays)}
          </div>
          <p className="card-meta">Total target for this cycle.</p>
        </article>
      </section>

      <section className="dashboard-card" style={{ maxWidth: "500px" }}>
        <div className="card-header">
          <h2>Add Savings</h2>
        </div>

        {error && <div className="message-box error">{error}</div>}

        <div className="form-group">
          <label>Number of Days</label>
          <input
            type="number"
            min="1"
            max={remainingDays}
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
            className="form-input"
            disabled={loading}
          />
          <p className="form-hint">You can add up to {remainingDays} days.</p>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="manual"
                checked={paymentMethod === "manual"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Manual Entry
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value="paystack"
                checked={paymentMethod === "paystack"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay with Bank/Card
            </label>
          </div>
        </div>

        <div className="withdrawal-summary">
          <div className="summary-item">
            <span>Total Amount</span>
            <strong>₦{formatCurrency(totalAmount)}</strong>
          </div>
          {!cycle.chargesTaken && (
            <div className="summary-item">
              <span>First-time App Charge</span>
              <strong>₦{formatCurrency(firstCharge)}</strong>
            </div>
          )}
          {paymentMethod === "paystack" && (
            <div className="summary-item">
              <span>Paystack Fee (1.5%)</span>
              <strong>₦{formatCurrency(paymentFee)}</strong>
            </div>
          )}
          <div
            className="summary-item"
            style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}
          >
            <span>Estimated Net Savings</span>
            <strong style={{ color: "#10b981" }}>
              ₦{formatCurrency(Math.max(netSavings, 0))}
            </strong>
          </div>
        </div>

        <div className="payment-actions">
          {paymentMethod === "manual" ? (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading || days < 1}
              style={{ flex: 1 }}
            >
              {loading ? "Processing..." : "Confirm Manual Entry"}
            </button>
          ) : (
            <PaystackPayment
              amount={totalAmount}
              days={days}
              onError={(message) => setError(message)}
            />
          )}
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </section>
    </main>
  );
}
