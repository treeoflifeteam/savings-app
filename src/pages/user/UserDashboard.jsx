import { useMemo } from "react";

import StatCard from "../../components/ui/StatCard";
import SkeletonBlock from "../../components/ui/SkeletonBlock";
import EmptyState from "../../components/ui/EmptyState";
import TransactionTimeline from "../../components/dashboard/TransactionTimeline";
import { useSavings } from "../../context/SavingsContext";

import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const {
    wallet,
    dashboardStats,
    dashboardRecentTransactions,
    activeCycles,
    totalSavings,
    walletLoading,
    dashboardLoading,
    transactionsLoading,
    cyclesLoading,
  } = useSavings();

  const activeCycle = activeCycles[0] || null;
  const loading =
    dashboardLoading || walletLoading || transactionsLoading || cyclesLoading;

  const progress = activeCycle
    ? Math.round(
        (activeCycle.contributedUnits /
          (activeCycle.durationCount || activeCycle.totalDays || 1)) *
          100,
      )
    : 0;

  const recentTransactions = useMemo(
    () => dashboardRecentTransactions || [],
    [dashboardRecentTransactions],
  );

  const formattedRecentTransactions = useMemo(
    () =>
      recentTransactions.map((tx) => {
        const typeMap = {
          wallet_credit: "deposit",
          contribution: "deposit",
          cycle_release: "deposit",
          withdrawal: "withdrawal",
          wallet_debit: "withdrawal",
          bonus: "bonus",
          admin_revenue: "bonus",
        };

        const labelMap = {
          deposit: "Deposit",
          withdrawal: "Withdrawal",
          bonus: "Reward",
        };

        const type = typeMap[tx.type] || "deposit";

        const title =
          tx.description || labelMap[type] || tx.type.replace(/_/g, " ");

        const date = new Date(tx.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return {
          type,
          title,
          amount: tx.amount,
          status: tx.status || "success",
          date,
          description:
            tx.description || `${labelMap[type] || "Transaction"} recorded.`,
        };
      }),
    [recentTransactions],
  );

  return (
    <div className="page-container">
      <div className="dashboard-header glass-card">
        <div>
          <h1>Welcome Back 👋</h1>

          <p className="text-muted">
            Track your savings growth and financial activity.
          </p>
        </div>

        <button className="save-btn">+ Save Money</button>
      </div>

      {loading ? (
        <div className="dashboard-grid">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="glass-card"
              style={{ minHeight: 120, padding: 20 }}
            >
              <SkeletonBlock height="22px" width="70%" className="mb-12" />
              <SkeletonBlock height="36px" width="50%" />
            </div>
          ))}
        </div>
      ) : (
        <div className="dashboard-grid">
          <StatCard
            title="Wallet Balance"
            value={`₦${wallet.availableBalance.toLocaleString()}`}
          />

          <StatCard
            title="Total Savings"
            value={`₦${totalSavings.toLocaleString()}`}
          />

          <StatCard
            title="Pending Deposits"
            value={dashboardStats.pendingDeposits}
          />

          <StatCard title="Savings Progress" value={`${progress}%`} />
        </div>
      )}

      <div className="glass-card savings-guide-card">
        <div className="guide-left">
          <h2>Save Into Your KoloPay</h2>

          <p className="text-muted">
            Transfer directly to the account below and always include your
            savings code in narration.
          </p>

          <div className="bank-box">
            <div>
              <small>Bank</small>

              <h3>OPay</h3>
            </div>

            <div>
              <small>Account Number</small>

              <h3>8012345678</h3>
            </div>
          </div>

          <div className="narration-box">
            <small>Narration</small>

            <h3>SAVE-TOL-4821</h3>
          </div>

          <div className="charge-warning">
            ⚠ Always add ₦50 extra during transfer to avoid broken savings
            records.
          </div>
        </div>

        <div className="guide-right">
          <div className="guide-circle">₦</div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="glass-card active-cycle-card">
          <div className="card-top">
            <div>
              <h2>Active Cycle</h2>

              <p className="text-muted">
                {activeCycle?.cycleType || "No active cycle"}
              </p>
            </div>

            <span className="status-badge">Active</span>
          </div>

          <div className="cycle-amount">
            ₦{activeCycle?.contributionAmount?.toLocaleString() || 0}
          </div>

          <p className="text-muted">Contribution per cycle</p>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span>
              {activeCycle?.contributedUnits || 0}/
              {activeCycle?.durationCount || activeCycle?.totalDays || 0}
            </span>
          </div>

          <div className="savings-code-box">
            <p className="text-muted">Your Savings Code</p>

            <h3>SAVE-TOL-4821</h3>

            <small>Always include this in transfer narration.</small>
          </div>
        </div>

        <div className="glass-card transactions-card">
          <div className="card-top">
            <h2>Recent Activity</h2>

            <button className="view-all-btn">View All</button>
          </div>

          <div className="transaction-list">
            {loading ? (
              <div>
                {[...Array(3)].map((item, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <SkeletonBlock height="20px" width="40%" className="mb-8" />
                    <SkeletonBlock height="16px" width="100%" />
                  </div>
                ))}
              </div>
            ) : formattedRecentTransactions.length > 0 ? (
              <TransactionTimeline
                transactions={formattedRecentTransactions.slice(0, 4)}
              />
            ) : (
              <EmptyState
                icon="🔔"
                title="No recent activity yet"
                subtitle="Start saving or make a deposit to see transactions here."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
