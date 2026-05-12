import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  AlertTriangle,
  Filter,
  Download,
} from "lucide-react";

import "../../styles/TransactionMonitoring.css";

const transactions = [
  {
    id: 1,

    type: "deposit",

    user:
      "Samuel Johnson",

    amount: "₦5,050",

    status:
      "completed",

    reference:
      "TRX-203944",

    time:
      "2 mins ago",
  },

  {
    id: 2,

    type:
      "withdrawal",

    user:
      "Grace Daniel",

    amount: "₦15,000",

    status:
      "pending",

    reference:
      "TRX-884422",

    time:
      "10 mins ago",
  },

  {
    id: 3,

    type: "saving",

    user:
      "Michael James",

    amount: "₦1,050",

    status:
      "completed",

    reference:
      "TRX-119244",

    time:
      "15 mins ago",
  },

  {
    id: 4,

    type: "failed",

    user:
      "Unknown Sender",

    amount: "₦10,050",

    status:
      "failed",

    reference:
      "TRX-774411",

    time:
      "22 mins ago",
  },
];

const getIcon = (
  type
) => {
  switch (type) {
    case "deposit":
      return (
        <ArrowDownLeft />
      );

    case "withdrawal":
      return (
        <ArrowUpRight />
      );

    case "saving":
      return (
        <PiggyBank />
      );

    default:
      return (
        <AlertTriangle />
      );
  }
};

const TransactionMonitoring =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="tm-header glass-card">
          <div>
            <h1>
              Transaction
              Monitoring
            </h1>

            <p className="text-muted">
              Monitor all
              financial
              transactions across
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

        <div className="tm-stats-grid">
          <div className="glass-card tm-stat">
            <span>
              Total Transactions
            </span>

            <h2>
              24,281
            </h2>
          </div>

          <div className="glass-card tm-stat">
            <span>
              Deposits Today
            </span>

            <h2>
              ₦1.2M
            </h2>
          </div>

          <div className="glass-card tm-stat">
            <span>
              Withdrawals
            </span>

            <h2>
              ₦640K
            </h2>
          </div>

          <div className="glass-card tm-stat warning">
            <span>
              Failed Transactions
            </span>

            <h2>
              7
            </h2>
          </div>
        </div>

        {/* =====================
            TOOLBAR
        ====================== */}

        <div className="glass-card tm-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search transactions, users or references..."
            />
          </div>

          <div className="tm-toolbar-right">
            <button className="toolbar-btn active">
              All
            </button>

            <button className="toolbar-btn">
              Deposits
            </button>

            <button className="toolbar-btn">
              Withdrawals
            </button>

            <button className="toolbar-btn">
              Savings
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

        <div className="glass-card tm-table-wrapper">
          <table className="tm-table">
            <thead>
              <tr>
                <th>
                  Type
                </th>

                <th>
                  User
                </th>

                <th>
                  Amount
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
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(
                (
                  transaction
                ) => (
                  <tr
                    key={
                      transaction.id
                    }
                  >
                    <td>
                      <div className="type-cell">
                        <div
                          className={`type-icon ${transaction.type}`}
                        >
                          {getIcon(
                            transaction.type
                          )}
                        </div>

                        <span className="capitalize">
                          {
                            transaction.type
                          }
                        </span>
                      </div>
                    </td>

                    <td>
                      {
                        transaction.user
                      }
                    </td>

                    <td className="amount-cell">
                      {
                        transaction.amount
                      }
                    </td>

                    <td>
                      <span
                        className={`status-badge ${transaction.status}`}
                      >
                        {
                          transaction.status
                        }
                      </span>
                    </td>

                    <td>
                      {
                        transaction.reference
                      }
                    </td>

                    <td>
                      {
                        transaction.time
                      }
                    </td>

                    <td>
                      <button className="view-btn">
                        View
                      </button>
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

export default TransactionMonitoring;