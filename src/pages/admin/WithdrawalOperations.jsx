import {
  Search,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Download,
  Wallet,
} from "lucide-react";

import "../../styles/WithdrawalOperations.css";

const withdrawals = [
  {
    id: 1,

    user:
      "Samuel Johnson",

    bank:
      "GTBank",

    account:
      "0123456789",

    amount: "₦15,000",

    type: "user",

    status:
      "pending",

    reference:
      "WTH-203944",

    time:
      "5 mins ago",
  },

  {
    id: 2,

    user:
      "Grace Daniel",

    bank:
      "Opay",

    account:
      "9087765544",

    amount: "₦45,500",

    type: "agent",

    status:
      "approved",

    reference:
      "WTH-882211",

    time:
      "18 mins ago",
  },

  {
    id: 3,

    user:
      "Michael James",

    bank:
      "UBA",

    account:
      "1022449911",

    amount: "₦8,000",

    type: "user",

    status:
      "failed",

    reference:
      "WTH-448822",

    time:
      "1 hour ago",
  },
];

const WithdrawalOperations =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="wo-header glass-card">
          <div>
            <h1>
              Withdrawal
              Operations
            </h1>

            <p className="text-muted">
              Monitor and manage
              all payout
              operations across
              the KoloPay
              ecosystem.
            </p>
          </div>

          <button className="export-btn">
            <Download
              size={18}
            />

            Export
          </button>
        </div>

        {/* =====================
            STATS
        ====================== */}

        <div className="wo-stats-grid">
          <div className="glass-card wo-stat-card">
            <div className="wo-icon green">
              <Wallet size={22} />
            </div>

            <div>
              <span>
                Today's Payouts
              </span>

              <h2>
                ₦640K
              </h2>
            </div>
          </div>

          <div className="glass-card wo-stat-card">
            <div className="wo-icon yellow">
              <Clock3 size={22} />
            </div>

            <div>
              <span>
                Pending
              </span>

              <h2>
                14
              </h2>
            </div>
          </div>

          <div className="glass-card wo-stat-card">
            <div className="wo-icon blue">
              <CheckCircle2
                size={22}
              />
            </div>

            <div>
              <span>
                Successful
              </span>

              <h2>
                182
              </h2>
            </div>
          </div>

          <div className="glass-card wo-stat-card">
            <div className="wo-icon red">
              <AlertTriangle
                size={22}
              />
            </div>

            <div>
              <span>
                Failed
              </span>

              <h2>
                3
              </h2>
            </div>
          </div>
        </div>

        {/* =====================
            TOOLBAR
        ====================== */}

        <div className="glass-card wo-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search withdrawals, users or references..."
            />
          </div>

          <div className="wo-toolbar-right">
            <button className="toolbar-btn active">
              All
            </button>

            <button className="toolbar-btn">
              Pending
            </button>

            <button className="toolbar-btn">
              Successful
            </button>

            <button className="toolbar-btn">
              Failed
            </button>

            <button className="filter-btn">
              <Filter
                size={16}
              />

              Filters
            </button>
          </div>
        </div>

        {/* =====================
            TABLE
        ====================== */}

        <div className="glass-card wo-table-wrapper">
          <table className="wo-table">
            <thead>
              <tr>
                <th>
                  User
                </th>

                <th>
                  Bank
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Type
                </th>

                <th>
                  Status
                </th>

                <th>
                  Reference
                </th>

                <th>
                  Time
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.map(
                (
                  withdrawal
                ) => (
                  <tr
                    key={
                      withdrawal.id
                    }
                  >
                    <td>
                      <div className="wo-user-cell">
                        <div className="wo-avatar">
                          {
                            withdrawal.user[0]
                          }
                        </div>

                        <div>
                          <h4>
                            {
                              withdrawal.user
                            }
                          </h4>

                          <p>
                            {
                              withdrawal.account
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      {
                        withdrawal.bank
                      }
                    </td>

                    <td className="amount-cell">
                      {
                        withdrawal.amount
                      }
                    </td>

                    <td>
                      <span
                        className={`type-badge ${withdrawal.type}`}
                      >
                        {
                          withdrawal.type
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${withdrawal.status}`}
                      >
                        {
                          withdrawal.status
                        }
                      </span>
                    </td>

                    <td>
                      {
                        withdrawal.reference
                      }
                    </td>

                    <td>
                      {
                        withdrawal.time
                      }
                    </td>

                    <td>
                      <div className="wo-actions">
                        {withdrawal.status ===
                        "pending" ? (
                          <>
                            <button className="approve-btn">
                              <CheckCircle2
                                size={
                                  16
                                }
                              />

                              Approve
                            </button>

                            <button className="reject-btn">
                              <XCircle
                                size={
                                  16
                                }
                              />

                              Reject
                            </button>
                          </>
                        ) : (
                          <button className="view-btn">
                            View
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

export default WithdrawalOperations;