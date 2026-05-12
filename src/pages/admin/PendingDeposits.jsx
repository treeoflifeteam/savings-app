import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import "../../styles/PendingDeposits.css";

const pendingDeposits = [
  {
    id: 1,

    amount: "₦5,050",

    senderName:
      "John Doe",

    senderAccount:
      "3021457781",

    narration:
      "KPAY-2041",

    time:
      "Today, 10:24 AM",

    possibleUser:
      "Samuel Johnson",

    confidence: "High",
  },

  {
    id: 2,

    amount: "₦2,050",

    senderName:
      "Ade Williams",

    senderAccount:
      "0039482281",

    narration:
      "Transfer",

    time:
      "Today, 09:12 AM",

    possibleUser:
      "No exact match",

    confidence: "Low",
  },

  {
    id: 3,

    amount: "₦10,050",

    senderName:
      "Mary Gold",

    senderAccount:
      "1920047782",

    narration:
      "Savings",

    time:
      "Yesterday",

    possibleUser:
      "Mary Gold",

    confidence: "Medium",
  },
];

const PendingDeposits = () => {
  return (
    <div className="page-container">
      {/* =====================
          HEADER
      ====================== */}

      <div className="pending-header glass-card">
        <div>
          <h1>
            Pending Deposits
          </h1>

          <p className="text-muted">
            Review unmatched
            savings deposits and
            manually reconcile
            transactions.
          </p>
        </div>

        <div className="pending-summary">
          <div className="summary-badge">
            <AlertTriangle
              size={18}
            />

            18 Pending
          </div>
        </div>
      </div>

      {/* =====================
          FILTER BAR
      ====================== */}

      <div className="glass-card pending-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search sender, narration or account..."
          />
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn active">
            All
          </button>

          <button className="toolbar-btn">
            High
            Confidence
          </button>

          <button className="toolbar-btn">
            Low
            Confidence
          </button>
        </div>
      </div>

      {/* =====================
          TABLE
      ====================== */}

      <div className="glass-card pending-table-wrapper">
        <table className="pending-table">
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
                Possible Match
              </th>

              <th>
                Confidence
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
            {pendingDeposits.map(
              (deposit) => (
                <tr
                  key={
                    deposit.id
                  }
                >
                  <td>
                    <div className="sender-cell">
                      <div className="sender-avatar">
                        {
                          deposit.senderName[0]
                        }
                      </div>

                      <div>
                        <h4>
                          {
                            deposit.senderName
                          }
                        </h4>

                        <p>
                          {
                            deposit.senderAccount
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="amount-cell">
                    {
                      deposit.amount
                    }
                  </td>

                  <td>
                    {
                      deposit.narration
                    }
                  </td>

                  <td>
                    {
                      deposit.possibleUser
                    }
                  </td>

                  <td>
                    <span
                      className={`confidence ${deposit.confidence.toLowerCase()}`}
                    >
                      {
                        deposit.confidence
                      }
                    </span>
                  </td>

                  <td>
                    <div className="time-cell">
                      <Clock3
                        size={15}
                      />

                      {
                        deposit.time
                      }
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="approve-btn">
                        <CheckCircle2
                          size={16}
                        />

                        Approve
                      </button>

                      <button className="reject-btn">
                        <XCircle
                          size={16}
                        />

                        Reject
                      </button>
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

export default PendingDeposits;