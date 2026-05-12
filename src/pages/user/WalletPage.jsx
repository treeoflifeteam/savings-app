import { useMemo } from "react";

import "../../styles/WalletPage.css";
import { useAuth } from "../../context/AuthContext";
import { useSavings } from "../../context/SavingsContext";
import EmptyState from "../../components/ui/EmptyState";

const WalletPage = () => {
  const { user } = useAuth();
  const { wallet, transactions, walletLoading } = useSavings();

  const pendingBalance = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === "pending")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  const recentWithdrawals = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "withdrawal" || tx.type === "wallet_debit")
        .slice(0, 3)
        .map((tx) => ({
          id: tx._id || tx.reference || `${tx.type}-${tx.createdAt}`,
          amount: tx.amount,
          bank: tx.metadata?.bankName || tx.metadata?.bank || "Bank transfer",
          status: tx.status || "completed",
        })),
    [transactions],
  );

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================== */}

      <div className="wallet-header glass-card">
        <div>
          <h1>Wallet & Withdrawals</h1>

          <p className="text-muted">
            Manage your wallet balance and transfer funds securely.
          </p>
        </div>
      </div>

      {/* =========================
          WALLET STATS
      ========================== */}

      <div className="wallet-stats">
        <div className="glass-card wallet-card primary">
          <span>Available Balance</span>

          <h2>
            {walletLoading
              ? "..."
              : `₦${wallet.availableBalance.toLocaleString()}`}
          </h2>
        </div>

        <div className="glass-card wallet-card">
          <span>Pending Balance</span>

          <h2>
            {walletLoading ? "..." : `₦${pendingBalance.toLocaleString()}`}
          </h2>
        </div>

        <div className="glass-card wallet-card">
          <span>Locked Savings</span>

          <h2>
            {walletLoading
              ? "..."
              : `₦${wallet.lockedBalance.toLocaleString()}`}
          </h2>
        </div>

        {user?.role === "agent" && (
          <div className="glass-card wallet-card secondary">
            <span>Agent Earnings</span>

            <h2>
              {walletLoading
                ? "..."
                : `₦${wallet.pendingCommission.toLocaleString()}`}
            </h2>
          </div>
        )}
      </div>

      {/* =========================
          MAIN GRID
      ========================== */}

      <div className="wallet-grid">
        {/* =====================
            WITHDRAW FORM
        ====================== */}

        <div className="glass-card withdraw-card">
          <h2>Withdraw Funds</h2>

          {/* BANK */}

          <div className="form-group">
            <label>Bank Name</label>

            <select>
              <option>Select Bank</option>

              <option>Access Bank</option>

              <option>GTBank</option>

              <option>First Bank</option>

              <option>Opay</option>
            </select>
          </div>

          {/* ACCOUNT NUMBER */}

          <div className="form-group">
            <label>Account Number</label>

            <input type="text" placeholder="0123456789" />
          </div>

          {/* ACCOUNT NAME */}

          <div className="verified-account">✓ John Doe</div>

          {/* AMOUNT */}

          <div className="form-group">
            <label>Amount</label>

            <input type="number" placeholder="5000" />
          </div>

          {/* INFO */}

          <div className="withdraw-info">
            <div>
              <span>Monnify Charge</span>

              <strong>₦50</strong>
            </div>

            <div>
              <span>You Receive</span>

              <strong>₦4,950</strong>
            </div>
          </div>

          {/* BUTTON */}

          <button className="withdraw-submit-btn">Withdraw To Bank</button>
        </div>

        {/* =====================
            RIGHT PANEL
        ====================== */}

        <div className="wallet-side">
          {/* BANK CARD */}

          <div className="glass-card saved-bank-card">
            <div className="bank-top">
              <h3>Saved Bank</h3>

              <button>Edit</button>
            </div>

            <div className="saved-bank-box">
              <small>GTBank</small>

              <h2>0123456789</h2>

              <p>John Doe</p>
            </div>
          </div>

          {/* HISTORY */}

          <div className="glass-card payout-history-card">
            <div className="bank-top">
              <h3>Recent Withdrawals</h3>

              <button>View All</button>
            </div>

            <div className="payout-list">
              {walletLoading ? (
                <p>Loading history...</p>
              ) : recentWithdrawals.length > 0 ? (
                recentWithdrawals.map((item) => (
                  <div className="payout-item" key={item.id}>
                    <div>
                      <h4>₦{item.amount.toLocaleString()}</h4>

                      <p>{item.bank}</p>
                    </div>

                    <span className={`payout-status ${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon="💳"
                  title="No withdrawal activity yet"
                  subtitle="Your recent withdrawal transactions will appear here once processed."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
