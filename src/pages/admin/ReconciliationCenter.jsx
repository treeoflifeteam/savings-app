import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  RefreshCcw,
  Clock3,
  Filter,
} from "lucide-react";

import "../../styles/ReconciliationCenter.css";

const records = [
  {
    id: 1,

    sender:
      "John Doe",

    amount: "₦5,050",

    narration:
      "KPAY-2041",

    matchedUser:
      "Samuel Johnson",

    confidence: "high",

    status:
      "matched",

    time:
      "2 mins ago",
  },

  {
    id: 2,

    sender:
      "Ade Williams",

    amount: "₦10,000",

    narration:
      "Transfer",

    matchedUser:
      "No Match",

    confidence: "low",

    status:
      "pending",

    time:
      "12 mins ago",
  },

  {
    id: 3,

    sender:
      "Mary Gold",

    amount: "₦15,050",

    narration:
      "Savings",

    matchedUser:
      "Mary Gold",

    confidence:
      "medium",

    status:
      "review",

    time:
      "20 mins ago",
  },
];

const ReconciliationCenter =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="rc-header glass-card">
          <div>
            <h1>
              Reconciliation
              Center
            </h1>

            <p className="text-muted">
              Monitor and
              reconcile all bank
              inflows, narration
              matches and pending
              savings deposits.
            </p>
          </div>

          <button className="sync-btn">
            <RefreshCcw
              size={18}
            />

            Sync Bank Feed
          </button>
        </div>

        {/* =====================
            STATS
        ====================== */}

        <div className="rc-stats-grid">
          <div className="glass-card rc-stat">
            <span>
              Total Inflows
            </span>

            <h2>
              ₦4.8M
            </h2>
          </div>

          <div className="glass-card rc-stat success">
            <span>
              Auto Matched
            </span>

            <h2>
              1,422
            </h2>
          </div>

          <div className="glass-card rc-stat warning">
            <span>
              Pending Review
            </span>

            <h2>
              18
            </h2>
          </div>

          <div className="glass-card rc-stat danger">
            <span>
              Suspicious
            </span>

            <h2>
              4
            </h2>
          </div>
        </div>

        {/* =====================
            TOOLBAR
        ====================== */}

        <div className="glass-card rc-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search narrations, users or senders..."
            />
          </div>

          <div className="rc-toolbar-right">
            <button className="toolbar-btn active">
              All
            </button>

            <button className="toolbar-btn">
              Matched
            </button>

            <button className="toolbar-btn">
              Pending
            </button>

            <button className="toolbar-btn">
              Suspicious
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

        <div className="glass-card rc-table-wrapper">
          <table className="rc-table">
            <thead>
              <tr>
                <th>
                  Sender
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Narration
                </th>

                <th>
                  Match
                </th>

                <th>
                  Confidence
                </th>

                <th>
                  Status
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
              {records.map(
                (record) => (
                  <tr
                    key={record.id}
                  >
                    <td>
                      <div className="rc-user">
                        <div className="rc-avatar">
                          {
                            record.sender[0]
                          }
                        </div>

                        <div>
                          <h4>
                            {
                              record.sender
                            }
                          </h4>

                          <p>
                            Bank
                            Transfer
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="bold">
                      {
                        record.amount
                      }
                    </td>

                    <td>
                      {
                        record.narration
                      }
                    </td>

                    <td>
                      {
                        record.matchedUser
                      }
                    </td>

                    <td>
                      <span
                        className={`confidence ${record.confidence}`}
                      >
                        {
                          record.confidence
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${record.status}`}
                      >
                        {
                          record.status
                        }
                      </span>
                    </td>

                    <td>
                      <div className="time-cell">
                        <Clock3
                          size={15}
                        />

                        {
                          record.time
                        }
                      </div>
                    </td>

                    <td>
                      <div className="rc-actions">
                        <button className="view-btn">
                          Review
                        </button>

                        {record.status ===
                          "pending" && (
                          <button className="approve-btn">
                            <CheckCircle2
                              size={
                                16
                              }
                            />

                            Match
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

        {/* =====================
            ALERT PANEL
        ====================== */}

        <div className="glass-card fraud-panel">
          <div className="fraud-header">
            <ShieldAlert
              size={22}
            />

            <h3>
              Fraud & Duplicate
              Detection
            </h3>
          </div>

          <div className="fraud-list">
            <div className="fraud-item">
              <AlertTriangle
                size={18}
              />

              Multiple deposits
              with same narration
              detected.
            </div>

            <div className="fraud-item">
              <AlertTriangle
                size={18}
              />

              Possible duplicate
              sender account
              usage detected.
            </div>
          </div>
        </div>
      </div>
    );
  };

export default ReconciliationCenter;