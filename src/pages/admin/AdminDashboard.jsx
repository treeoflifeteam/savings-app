import { useNavigate } from "react-router-dom";
import {
  Users,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  PiggyBank,
} from "lucide-react";

import "../../styles/AdminDashboard.css";

const recentActivities = [
  {
    title: "Pending Deposit Requires Review",

    amount: "₦5,050",

    type: "warning",

    time: "2 mins ago",
  },

  {
    title: "Withdrawal Processed",

    amount: "₦15,000",

    type: "success",

    time: "12 mins ago",
  },

  {
    title: "New User Registered",

    amount: "+1 user",

    type: "info",

    time: "18 mins ago",
  },

  {
    title: "Agent Bonus Released",

    amount: "₦2,500",

    type: "bonus",

    time: "35 mins ago",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handlePendingDepositsClick = () => {
    navigate("/admin/pending-deposits");
  };

  const handleApproveWithdrawalsClick = () => {
    navigate("/admin/withdrawal-operations");
  };

  const handleManageUsersClick = () => {
    navigate("/admin/user-management");
  };

  return (
    <div className="page-container">
      {/* =====================
          HEADER
      ====================== */}

      <div className="admin-header glass-card">
        <div>
          <h1>Operations Center</h1>

          <p className="text-muted">
            Monitor platform activities, deposits, withdrawals and
            reconciliation workflows.
          </p>
        </div>
      </div>

      {/* =====================
          TOP STATS
      ====================== */}

      <div className="admin-stats-grid">
        <div className="glass-card admin-stat-card">
          <div className="stat-icon green">
            <Wallet size={24} />
          </div>

          <div>
            <span>Total Platform Savings</span>

            <h2>₦12.4M</h2>
          </div>
        </div>

        <div className="glass-card admin-stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>

          <div>
            <span>Active Users</span>

            <h2>2,481</h2>
          </div>
        </div>

        <div className="glass-card admin-stat-card">
          <div className="stat-icon yellow">
            <AlertTriangle size={24} />
          </div>

          <div>
            <span>Pending Deposits</span>

            <h2>18</h2>
          </div>
        </div>

        <div className="glass-card admin-stat-card">
          <div className="stat-icon red">
            <ShieldAlert size={24} />
          </div>

          <div>
            <span>Flagged Cases</span>

            <h2>3</h2>
          </div>
        </div>
      </div>

      {/* =====================
          MAIN GRID
      ====================== */}

      <div className="admin-main-grid">
        {/* =================
            LEFT SIDE
        ================== */}

        <div className="admin-left">
          {/* QUICK ACTIONS */}

          <div className="glass-card quick-actions">
            <div className="section-top">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-grid">
              <button
                type="button"
                className="quick-btn"
                onClick={handlePendingDepositsClick}
              >
                <AlertTriangle size={18} />
                Review Pending Deposits
              </button>

              <button
                type="button"
                className="quick-btn"
                onClick={handleApproveWithdrawalsClick}
              >
                <ArrowUpRight size={18} />
                Approve Withdrawals
              </button>

              <button
                type="button"
                className="quick-btn"
                onClick={handleManageUsersClick}
              >
                <Users size={18} />
                Manage Users
              </button>

              <button type="button" className="quick-btn">
                <PiggyBank size={18} />
                Savings Analytics
              </button>
            </div>
          </div>

          {/* RECENT ACTIVITIES */}

          <div className="glass-card activity-panel">
            <div className="section-top">
              <h2>Recent Operations</h2>

              <button>View All</button>
            </div>

            <div className="activity-list">
              {recentActivities.map((item, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-dot ${item.type}`} />

                  <div className="activity-content">
                    <h4>{item.title}</h4>

                    <p>{item.time}</p>
                  </div>

                  <div className="activity-amount">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================
            RIGHT SIDE
        ================== */}

        <div className="admin-right">
          {/* ALERTS */}

          <div className="glass-card admin-alerts">
            <div className="section-top">
              <h2>System Alerts</h2>
            </div>

            <div className="alert-box danger">
              <h4>3 Suspicious Transactions</h4>

              <p>Transactions awaiting manual verification.</p>
            </div>

            <div className="alert-box warning">
              <h4>Pending Deposit Build-Up</h4>

              <p>18 unmatched deposits require reconciliation.</p>
            </div>

            <div className="alert-box success">
              <h4>Withdrawal Queue Stable</h4>

              <p>All withdrawals processed successfully.</p>
            </div>
          </div>

          {/* PERFORMANCE */}

          <div className="glass-card performance-card">
            <div className="section-top">
              <h2>Today's Flow</h2>
            </div>

            <div className="flow-item">
              <div>
                <ArrowDownLeft size={18} />
                Deposits
              </div>

              <strong>₦1.2M</strong>
            </div>

            <div className="flow-item">
              <div>
                <ArrowUpRight size={18} />
                Withdrawals
              </div>

              <strong>₦640K</strong>
            </div>

            <div className="flow-item">
              <div>
                <PiggyBank size={18} />
                New Savings
              </div>

              <strong>₦870K</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
