import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSavings } from "../context/SavingsContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function AdminReports() {
  const { users, refreshAllUsers } = useSavings();

  useEffect(() => {
    refreshAllUsers();
  }, [refreshAllUsers]);

  const reportData = useMemo(() => {
    const recentActivity = users
      .flatMap((user) =>
        (user.transactions || []).map((transaction) => ({
          ...transaction,
          userName: user.name,
        })),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalDeposits = users.reduce(
      (sum, user) =>
        sum +
        (user.transactions || [])
          .filter((tx) => tx.type === "deposit")
          .reduce((sub, tx) => sub + tx.amount, 0),
      0,
    );

    const totalWithdrawals = users.reduce(
      (sum, user) =>
        sum +
        (user.transactions || [])
          .filter((tx) => tx.type === "withdrawal")
          .reduce((sub, tx) => sub + tx.amount, 0),
      0,
    );

    const totalCharges = users.reduce(
      (sum, user) =>
        sum +
        (user.transactions || [])
          .filter((tx) => tx.type === "charge")
          .reduce((sub, tx) => sub + tx.amount, 0),
      0,
    );

    const totalSavings = users.reduce(
      (sum, user) =>
        sum +
        (user.transactions || [])
          .filter((tx) => tx.type === "deposit")
          .reduce((sub, tx) => sub + tx.amount, 0),
      0,
    );

    const activeCycles = users.filter(
      (user) => user.currentCycle?.status === "active",
    ).length;

    const completedCycles = users.reduce(
      (sum, user) => sum + (user.cycles?.length || 0),
      0,
    );

    const topSavers = users
      .map((user) => {
        const cycleBalance = (user.transactions || []).reduce(
          (sum, tx) => sum + tx.effect,
          0,
        );
        return {
          id: user.id,
          name: user.name,
          totalAssets: user.walletBalance + cycleBalance,
        };
      })
      .sort((a, b) => b.totalAssets - a.totalAssets)
      .slice(0, 5);

    return {
      totalUsers: users.length,
      activeCycles,
      completedCycles,
      totalDeposits,
      totalWithdrawals,
      totalCharges,
      totalSavings,
      recentActivity: recentActivity.slice(0, 8),
      topSavers,
    };
  }, [users]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Admin analytics</p>
          <h1 className="dashboard-title">Reports & Insights</h1>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin-dashboard" className="btn btn-secondary">
            User Dashboard
          </Link>
          <Link to="/admin-users" className="btn btn-secondary">
            Manage Users
          </Link>
        </div>
      </section>

      <section className="dashboard-grid reports-grid">
        <article className="dashboard-card report-card">
          <span className="card-title">Active Users</span>
          <p className="card-value">{reportData.totalUsers}</p>
        </article>
        <article className="dashboard-card report-card">
          <span className="card-title">Active Cycles</span>
          <p className="card-value">{reportData.activeCycles}</p>
        </article>
        <article className="dashboard-card report-card">
          <span className="card-title">Completed Cycles</span>
          <p className="card-value">{reportData.completedCycles}</p>
        </article>
        <article className="dashboard-card report-card">
          <span className="card-title">Total Balance Locked</span>
          <p className="card-value">
            ₦{formatCurrency(reportData.totalSavings)}
          </p>
        </article>
      </section>

      <section className="dashboard-grid reports-grid">
        <article className="dashboard-card report-card report-summary">
          <h2>Financial Summary</h2>
          <div className="summary-grid">
            <div>
              <span>Total Deposits</span>
              <strong>₦{formatCurrency(reportData.totalDeposits)}</strong>
            </div>
            <div>
              <span>Total Withdrawals</span>
              <strong>₦{formatCurrency(reportData.totalWithdrawals)}</strong>
            </div>
            <div>
              <span>Total Charges</span>
              <strong>₦{formatCurrency(reportData.totalCharges)}</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card report-card report-summary">
          <h2>Top Savers</h2>
          <div className="top-savers">
            {reportData.topSavers.length === 0 ? (
              <p className="empty-state">No users available yet.</p>
            ) : (
              reportData.topSavers.map((saver, index) => (
                <div key={saver.id} className="top-saver-item">
                  <span>
                    {index + 1}. {saver.name}
                  </span>
                  <strong>₦{formatCurrency(saver.totalAssets)}</strong>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-grid reports-grid">
        <article className="dashboard-card report-card">
          <h2>Recent Activity</h2>
          {reportData.recentActivity.length === 0 ? (
            <p className="empty-state">No recent transactions.</p>
          ) : (
            <div className="activity-list">
              {reportData.recentActivity.map((transaction) => (
                <div
                  key={`${transaction.id}-${transaction.date}`}
                  className="activity-item"
                >
                  <div>
                    <p>{transaction.userName}</p>
                    <small>
                      {transaction.type} •{" "}
                      {new Date(transaction.date).toLocaleString()}
                    </small>
                  </div>
                  <strong
                    className={transaction.effect < 0 ? "negative" : "positive"}
                  >
                    {transaction.effect < 0 ? "-" : "+"}₦
                    {formatCurrency(Math.abs(transaction.amount))}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
