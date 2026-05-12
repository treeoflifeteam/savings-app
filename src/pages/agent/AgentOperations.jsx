import {
  Users,
  Wallet,
  Trophy,
  Search,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  TrendingUp,
  Eye,
} from "lucide-react";

import "../../styles/AgentOperations.css";

const agents = [
  {
    id: 1,

    name:
      "Grace Daniel",

    referrals: 124,

    activeUsers: 91,

    wallet:
      "₦82,500",

    locked:
      "₦34,000",

    bonus:
      "₦5,200",

    status: "active",

    performance:
      "high",
  },

  {
    id: 2,

    name:
      "Michael James",

    referrals: 52,

    activeUsers: 31,

    wallet:
      "₦25,000",

    locked:
      "₦11,500",

    bonus:
      "₦1,400",

    status: "active",

    performance:
      "medium",
  },

  {
    id: 3,

    name:
      "Sarah Gold",

    referrals: 11,

    activeUsers: 4,

    wallet:
      "₦4,000",

    locked:
      "₦1,500",

    bonus: "₦0",

    status:
      "flagged",

    performance: "low",
  },
];

const AgentOperations =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="ao-header glass-card">
          <div>
            <h1>
              Agent Operations
            </h1>

            <p className="text-muted">
              Monitor referrals,
              commissions,
              performance and
              monthly wallet
              releases.
            </p>
          </div>

          <div className="ao-summary">
            <div className="summary-pill">
              <Users size={18} />

              184 Active Agents
            </div>
          </div>
        </div>

        {/* =====================
            STATS
        ====================== */}

        <div className="ao-stats-grid">
          <div className="glass-card ao-stat-card">
            <div className="ao-icon green">
              <Users size={22} />
            </div>

            <div>
              <span>
                Total Agents
              </span>

              <h2>
                184
              </h2>
            </div>
          </div>

          <div className="glass-card ao-stat-card">
            <div className="ao-icon blue">
              <TrendingUp
                size={22}
              />
            </div>

            <div>
              <span>
                Referrals
              </span>

              <h2>
                4,281
              </h2>
            </div>
          </div>

          <div className="glass-card ao-stat-card">
            <div className="ao-icon yellow">
              <Clock3 size={22} />
            </div>

            <div>
              <span>
                Locked Wallets
              </span>

              <h2>
                ₦2.4M
              </h2>
            </div>
          </div>

          <div className="glass-card ao-stat-card">
            <div className="ao-icon purple">
              <Trophy size={22} />
            </div>

            <div>
              <span>
                Bonuses
              </span>

              <h2>
                ₦640K
              </h2>
            </div>
          </div>
        </div>

        {/* =====================
            TOOLBAR
        ====================== */}

        <div className="glass-card ao-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search agents..."
            />
          </div>

          <div className="ao-toolbar-right">
            <button className="toolbar-btn active">
              All
            </button>

            <button className="toolbar-btn">
              High Performers
            </button>

            <button className="toolbar-btn">
              Flagged
            </button>

            <button className="toolbar-btn">
              Wallet Releases
            </button>
          </div>
        </div>

        {/* =====================
            TABLE
        ====================== */}

        <div className="glass-card ao-table-wrapper">
          <table className="ao-table">
            <thead>
              <tr>
                <th>
                  Agent
                </th>

                <th>
                  Referrals
                </th>

                <th>
                  Active Users
                </th>

                <th>
                  Available Wallet
                </th>

                <th>
                  Locked Wallet
                </th>

                <th>
                  Bonus
                </th>

                <th>
                  Performance
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {agents.map(
                (agent) => (
                  <tr
                    key={agent.id}
                  >
                    <td>
                      <div className="ao-agent-cell">
                        <div className="ao-avatar">
                          {
                            agent.name[0]
                          }
                        </div>

                        <div>
                          <h4>
                            {
                              agent.name
                            }
                          </h4>

                          <p>
                            Agent
                            Partner
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      {
                        agent.referrals
                      }
                    </td>

                    <td>
                      {
                        agent.activeUsers
                      }
                    </td>

                    <td className="bold">
                      {
                        agent.wallet
                      }
                    </td>

                    <td className="bold warning-text">
                      {
                        agent.locked
                      }
                    </td>

                    <td className="bold">
                      {
                        agent.bonus
                      }
                    </td>

                    <td>
                      <span
                        className={`performance-badge ${agent.performance}`}
                      >
                        {
                          agent.performance
                        }
                      </span>
                    </td>

                    <td>
                      <div className="ao-actions">
                        <button className="view-btn">
                          <Eye
                            size={16}
                          />

                          View
                        </button>

                        <button className="release-btn">
                          <Wallet
                            size={16}
                          />

                          Release
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =====================
            ALERT PANEL
        ====================== */}

        <div className="glass-card ao-alert-panel">
          <div className="alert-header">
            <ShieldAlert
              size={22}
            />

            <h3>
              Agent Monitoring
              Alerts
            </h3>
          </div>

          <div className="alert-list">
            <div className="alert-item">
              High referral
              spike detected from
              one agent account.
            </div>

            <div className="alert-item">
              Monthly commission
              release pending for
              18 agents.
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AgentOperations;