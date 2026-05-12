# SYSTEM OVERVIEW – SAVINGS APP

This document explains the full mental model of the system.

---

# CORE IDEA

This is a ledger-based financial savings system with:

- Contributions
- Withdrawals
- Charges
- Agent commissions
- Payment verification

---

# SOURCE OF TRUTH

Ledger System is the ONLY source of truth.

Everything else is derived:
- balances
- reports
- savings
- commissions

---

# SYSTEM FLOW

User Action
→ Payment Verification
→ Contribution Engine
→ Ledger Update
→ Commission Engine
→ Balance Computation

---

# CRITICAL RULE

Never trust UI or frontend state for financial data.