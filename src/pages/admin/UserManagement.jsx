import {
  Search,
  ShieldAlert,
  Wallet,
  PiggyBank,
  Users,
  Ban,
  CheckCircle2,
  Eye,
} from "lucide-react";

import "../../styles/UserManagement.css";

const users = [
  {
    id: 1,

    name:
      "Samuel Johnson",

    phone:
      "08012345678",

    role: "user",

    savings:
      "₦120,000",

    wallet:
      "₦14,500",

    status: "active",

    cycles: 3,
  },

  {
    id: 2,

    name:
      "Grace Daniel",

    phone:
      "08087654321",

    role: "agent",

    savings:
      "₦450,000",

    wallet:
      "₦55,000",

    status: "active",

    cycles: 7,
  },

  {
    id: 3,

    name:
      "Michael James",

    phone:
      "08123456789",

    role: "user",

    savings:
      "₦12,000",

    wallet:
      "₦500",

    status: "blocked",

    cycles: 1,
  },
];

const UserManagement =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="um-header glass-card">
          <div>
            <h1>
              User Management
            </h1>

            <p className="text-muted">
              Manage users,
              monitor wallets,
              inspect savings
              cycles and control
              account access.
            </p>
          </div>

          <div className="um-summary">
            <div className="summary-pill">
              <Users size={18} />

              2,481 Users
            </div>
          </div>
        </div>

        {/* =====================
            STATS
        ====================== */}

        <div className="um-stats-grid">
          <div className="glass-card um-stat-card">
            <div className="stat-icon green">
              <Users size={22} />
            </div>

            <div>
              <span>
                Total Users
              </span>

              <h2>
                2,481
              </h2>
            </div>
          </div>

          <div className="glass-card um-stat-card">
            <div className="stat-icon blue">
              <PiggyBank
                size={22}
              />
            </div>

            <div>
              <span>
                Active Savers
              </span>

              <h2>
                1,922
              </h2>
            </div>
          </div>

          <div className="glass-card um-stat-card">
            <div className="stat-icon yellow">
              <ShieldAlert
                size={22}
              />
            </div>

            <div>
              <span>
                Flagged Users
              </span>

              <h2>
                14
              </h2>
            </div>
          </div>

          <div className="glass-card um-stat-card">
            <div className="stat-icon red">
              <Ban size={22} />
            </div>

            <div>
              <span>
                Blocked Users
              </span>

              <h2>
                7
              </h2>
            </div>
          </div>
        </div>

        {/* =====================
            TOOLBAR
        ====================== */}

        <div className="glass-card um-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search users, phone numbers..."
            />
          </div>

          <div className="toolbar-actions">
            <button className="toolbar-btn active">
              All
            </button>

            <button className="toolbar-btn">
              Users
            </button>

            <button className="toolbar-btn">
              Agents
            </button>

            <button className="toolbar-btn">
              Blocked
            </button>
          </div>
        </div>

        {/* =====================
            TABLE
        ====================== */}

        <div className="glass-card um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>
                  User
                </th>

                <th>
                  Role
                </th>

                <th>
                  Savings
                </th>

                <th>
                  Wallet
                </th>

                <th>
                  Cycles
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map(
                (user) => (
                  <tr
                    key={user.id}
                  >
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {
                            user.name[0]
                          }
                        </div>

                        <div>
                          <h4>
                            {
                              user.name
                            }
                          </h4>

                          <p>
                            {
                              user.phone
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`role-badge ${user.role}`}
                      >
                        {
                          user.role
                        }
                      </span>
                    </td>

                    <td className="bold">
                      {
                        user.savings
                      }
                    </td>

                    <td className="bold">
                      {
                        user.wallet
                      }
                    </td>

                    <td>
                      {
                        user.cycles
                      }
                    </td>

                    <td>
                      <span
                        className={`status-badge ${user.status}`}
                      >
                        {
                          user.status
                        }
                      </span>
                    </td>

                    <td>
                      <div className="action-group">
                        <button className="action-btn view">
                          <Eye
                            size={16}
                          />

                          View
                        </button>

                        {user.status ===
                        "blocked" ? (
                          <button className="action-btn activate">
                            <CheckCircle2
                              size={16}
                            />

                            Activate
                          </button>
                        ) : (
                          <button className="action-btn block">
                            <Ban
                              size={16}
                            />

                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default UserManagement;