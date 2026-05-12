import "../../styles/TransactionTimeline.css";

const TransactionTimeline = ({
  transactions = [],
}) => {
  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "success":
        return "status-success";

      case "pending":
        return "status-pending";

      case "failed":
        return "status-failed";

      default:
        return "";
    }
  };

  const getTransactionIcon = (
    type
  ) => {
    switch (type) {
      case "deposit":
        return "↓";

      case "withdrawal":
        return "↑";

      case "bonus":
        return "🎁";

      case "charge":
        return "−";

      default:
        return "•";
    }
  };

  return (
    <div className="timeline-wrapper">
      {transactions.map(
        (tx, index) => (
          <div
            className="timeline-item"
            key={index}
          >
            {/* ICON */}

            <div className="timeline-icon">
              {getTransactionIcon(
                tx.type
              )}
            </div>

            {/* DETAILS */}

            <div className="timeline-details">
              <div className="timeline-top">
                <div>
                  <h4>
                    {
                      tx.title
                    }
                  </h4>

                  <p className="timeline-date">
                    {
                      tx.date
                    }
                  </p>
                </div>

                <div className="timeline-right">
                  <h3>
                    ₦
                    {tx.amount.toLocaleString()}
                  </h3>

                  <span
                    className={`timeline-status ${getStatusClass(
                      tx.status
                    )}`}
                  >
                    {
                      tx.status
                    }
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}

              {tx.description && (
                <p className="timeline-description">
                  {
                    tx.description
                  }
                </p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionTimeline;