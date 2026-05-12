import { useState } from "react";

import "../../styles/UserSavings.css";

const UserSavings = () => {
  const [cycleType, setCycleType] = useState("daily");

  const [amount, setAmount] = useState("");

  const [duration, setDuration] = useState("");

  const charges = {
    daily: 50,

    weekly: 350,

    monthly: 1500,

    fixed: 500,
  };

  const contribution = Number(amount || 0);

  const adminCharge = charges[cycleType];

  const totalContribution = contribution * Number(duration || 0);

  const estimatedMaturity = totalContribution;

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================== */}

      <div className="savings-header glass-card">
        <div>
          <h1>Start A Savings Cycle</h1>

          <p className="text-muted">
            Build consistent saving habits with flexible savings plans.
          </p>
        </div>
      </div>

      {/* =========================
          MAIN GRID
      ========================== */}

      <div className="savings-grid">
        {/* =====================
            LEFT
        ====================== */}

        <div className="glass-card savings-form-card">
          <h2>Create New Cycle</h2>

          {/* TYPE */}

          <div className="form-section">
            <label>Savings Type</label>

            <div className="cycle-options">
              <button
                className={cycleType === "daily" ? "active" : ""}
                onClick={() => setCycleType("daily")}
              >
                Daily
              </button>

              <button
                className={cycleType === "weekly" ? "active" : ""}
                onClick={() => setCycleType("weekly")}
              >
                Weekly
              </button>

              <button
                className={cycleType === "monthly" ? "active" : ""}
                onClick={() => setCycleType("monthly")}
              >
                Monthly
              </button>

              <button
                className={cycleType === "fixed" ? "active" : ""}
                onClick={() => setCycleType("fixed")}
              >
                Fixed
              </button>
            </div>
          </div>

          {/* AMOUNT */}

          <div className="form-section">
            <label>Contribution Amount</label>

            <input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* DURATION */}

          <div className="form-section">
            <label>Duration Count</label>

            <input
              type="number"
              placeholder={
                cycleType === "daily"
                  ? "30 days"
                  : cycleType === "weekly"
                    ? "12 weeks"
                    : "6 months"
              }
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* INFO */}

          <div className="cycle-info-box">
            <div>
              <span>Admin Charge</span>

              <strong>₦{adminCharge}</strong>
            </div>

            <div>
              <span>Estimated Savings</span>

              <strong>₦{estimatedMaturity.toLocaleString()}</strong>
            </div>
          </div>

          {/* BUTTON */}

          <button className="create-cycle-btn">Create Savings Cycle</button>
        </div>

        {/* =====================
            RIGHT
        ====================== */}

        <div className="glass-card savings-preview-card">
          <h2>Savings Preview</h2>

          <div className="preview-amount">
            ₦{estimatedMaturity.toLocaleString()}
          </div>

          <p className="text-muted">Estimated maturity balance</p>

          {/* DETAILS */}

          <div className="preview-list">
            <div className="preview-item">
              <span>Cycle Type</span>

              <strong>{cycleType}</strong>
            </div>

            <div className="preview-item">
              <span>Contribution</span>

              <strong>₦{contribution.toLocaleString()}</strong>
            </div>

            <div className="preview-item">
              <span>Duration</span>

              <strong>{duration || 0}</strong>
            </div>

            <div className="preview-item">
              <span>Admin Charge</span>

              <strong>₦{adminCharge}</strong>
            </div>
          </div>

          {/* NOTE */}

          <div className="preview-note">
            Your KoloPay cycle automatically tracks all verified deposits linked
            to your savings code.
          </div>
        </div>
      </div>

      {/* =========================
          SAVINGS HISTORY
      ========================== */}

      <div className="glass-card savings-history-card">
        <h2>Your Savings History</h2>

        {cyclesLoading ? (
          <div className="savings-history-loading">
            <SkeletonBlock width="100%" height="40px" />
            <SkeletonBlock width="100%" height="40px" />
            <SkeletonBlock width="100%" height="40px" />
            <SkeletonBlock width="100%" height="40px" />
            <SkeletonBlock width="100%" height="40px" />
          </div>
        ) : cycles.length > 0 ? (
          <div className="savings-history-table">
            <table>
              <thead>
                <tr>
                  <th>Cycle Type</th>
                  <th>Contribution</th>
                  <th>Total Saved</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((cycle) => (
                  <tr key={cycle._id}>
                    <td>
                      <span className="cycle-type-badge">
                        {cycle.cycleType}
                      </span>
                    </td>
                    <td>₦{cycle.contributionAmount?.toLocaleString()}</td>
                    <td>₦{cycle.totalSaved?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${cycle.status}`}>
                        {cycle.status}
                      </span>
                    </td>
                    <td>{new Date(cycle.startDate).toLocaleDateString()}</td>
                    <td>
                      {cycle.contributedUnits || 0} / {cycle.durationCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📊"
            title="No savings cycles yet"
            subtitle="Create your first savings cycle to start building your financial future."
          />
        )}
      </div>
    </div>
  );
};

export default UserSavings;
