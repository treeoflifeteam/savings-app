import StatCard from "../../components/ui/StatCard";

import "../../styles/AgentDashboard.css";

const AgentDashboard = () => {
  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================== */}

      <div className="agent-header glass-card">
        <div>
          <h1>
            Agent Workspace
          </h1>

          <p className="text-muted">
            Track referrals,
            commissions and
            monthly rewards.
          </p>
        </div>

        <button className="withdraw-btn">
          Withdraw Earnings
        </button>
      </div>

      {/* =========================
          STATS
      ========================== */}

      <div className="dashboard-grid">
        <StatCard
          title="Available Wallet"
          value="₦18,500"
        />

        <StatCard
          title="Locked Earnings"
          value="₦42,000"
        />

        <StatCard
          title="Monthly Bonus"
          value="₦5,400"
        />

        <StatCard
          title="Total Referrals"
          value="86"
        />
      </div>

      {/* =========================
          MAIN GRID
      ========================== */}

      <div className="agent-grid">
        {/* =====================
            PERFORMANCE
        ====================== */}

        <div className="glass-card performance-card">
          <div className="card-top">
            <h2>
              Performance
            </h2>

            <span className="rank-badge">
              TOP AGENT
            </span>
          </div>

          <div className="performance-stats">
            <div className="performance-item">
              <h3>
                62
              </h3>

              <p>
                Active Savers
              </p>
            </div>

            <div className="performance-item">
              <h3>
                38
              </h3>

              <p>
                Completed
                Cycles
              </p>
            </div>

            <div className="performance-item">
              <h3>
                ₦120k
              </h3>

              <p>
                Lifetime
                Earnings
              </p>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="monthly-target">
            <div className="target-top">
              <span>
                Monthly Target
              </span>

              <span>
                74%
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: "74%",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* =====================
            RECENT COMMISSIONS
        ====================== */}

        <div className="glass-card commissions-card">
          <div className="card-top">
            <h2>
              Recent Earnings
            </h2>

            <button>
              View All
            </button>
          </div>

          <div className="commission-list">
            <div className="commission-item">
              <div>
                <h4>
                  ₦500 Commission
                </h4>

                <p>
                  Sarah Johnson
                </p>
              </div>

              <span className="earning-status">
                Released
              </span>
            </div>

            <div className="commission-item">
              <div>
                <h4>
                  ₦100 Bonus
                </h4>

                <p>
                  Cycle completed
                </p>
              </div>

              <span className="earning-status pending">
                Locked
              </span>
            </div>

            <div className="commission-item">
              <div>
                <h4>
                  ₦300 First Cycle
                  Reward
                </h4>

                <p>
                  David James
                </p>
              </div>

              <span className="earning-status">
                Released
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          REFERRAL SECTION
      ========================== */}

      <div className="glass-card referral-card">
        <div className="card-top">
          <div>
            <h2>
              Your Referral Code
            </h2>

            <p className="text-muted">
              Invite more savers
              to grow your
              earnings.
            </p>
          </div>

          <button className="share-btn">
            Share Link
          </button>
        </div>

        <div className="referral-box">
          AGT-KOLO-4821
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;