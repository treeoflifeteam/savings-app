import { useState } from "react";
import { useSavings } from "../context/SavingsContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { useFormSubmit } from "../hooks/useApi";

export default function Withdraw() {
  const { users, withdraw, activeUserId } = useSavings();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");

  const user = users.find((u) => u.id === activeUserId);

  if (!user) return <p>Loading...</p>;

  const availableBalance = user.walletBalance;

  const { loading, error, formErrors, handleSubmit } = useFormSubmit(
    async (formData) => {
      await withdraw(user.id, Number(formData.amount));
      navigate("/dashboard");
    },
    {
      successMessage: "Withdrawal successful!",
      onError: (err) => {
        console.error("Withdrawal failed:", err);
      },
    },
  );

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }

    if (Number(amount) > availableBalance) {
      return;
    }

    await handleSubmit({ amount });
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Manage funds</p>
          <h1 className="dashboard-title">Withdraw Funds</h1>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-title">Available Balance</div>
          <div className="card-value">₦{formatCurrency(availableBalance)}</div>
        </article>
      </section>

      <section className="dashboard-card" style={{ maxWidth: "500px" }}>
        <div className="card-header">
          <h2>Withdrawal Form</h2>
        </div>

        {error && <div className="message-box error">{error}</div>}

        <div className="form-group">
          <label>Withdrawal Amount (₦)</label>
          <input
            type="number"
            min="0"
            max={availableBalance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="withdrawal-summary">
          <div className="summary-item">
            <span>Amount</span>
            <strong>₦{amount ? formatCurrency(Number(amount)) : "0"}</strong>
          </div>
          <div className="summary-item">
            <span>Remaining Balance</span>
            <strong>
              ₦
              {formatCurrency(
                Math.max(0, availableBalance - (amount ? Number(amount) : 0)),
              )}
            </strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
          <button
            className="btn btn-primary"
            onClick={handleWithdraw}
            disabled={loading || !amount || Number(amount) <= 0}
            style={{ flex: 1 }}
          >
            {loading ? "Processing..." : "Confirm Withdrawal"}
          </button>
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
