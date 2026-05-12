# DOMAIN RULES – SAVINGS APP

This document defines all financial rules and system behaviors.

---

# 1. PAYMENT VERIFICATION RULES

Payments are verified using:

- Gmail API (email receipt parsing)
- Payment gateway webhooks (Monnify or equivalent)

RULES:

- No payment is valid unless verified server-side
- Frontend confirmations are ignored
- Each payment must contain:
  - referenceId
  - amount
  - sender identity
  - timestamp

# 1.1 DIRECT BANK TRANSFER VERIFICATION

- Direct bank payments are monitored through the Gmail API.
- The system attempts to match incoming alerts using:
  - unique code in payment narration
  - account number
  - registered name provided at signup
- If a direct bank payment cannot be matched automatically:
  - funds move to a pending approval wallet
  - the payment is not processed into savings
  - admin approval is required before it can be finalized
- The backend sends a notification to admin for every pending direct payment.

---

# 2. CONTRIBUTION RULES

- Users contribute based on cycle:
  - daily
  - weekly
  - monthly
  - fixed

RULES:

- Contributions are immutable once recorded
- Partial payments allowed only if enabled
- Each contribution maps to a savings group
- All contributions must create ledger entries

---

# 3. SAVINGS RULES

- Savings are accumulated per user per group
- Savings cannot be directly edited
- Balance = sum(ledger entries)

---

# 4. WITHDRAWAL RULES

RULES:

- **Users**: Can only withdraw from **wallet balance** (availableBalance)
- **Users**: Cannot withdraw from current cycle balance (lockedBalance)
- **Users**: After cycle completes, money moves from lockedBalance to availableBalance
- **Users**: If money exists in wallet, can withdraw anytime
- **Agents**: Cannot withdraw anytime except at end of month (cron monitored)
- **Agents**: Commission earnings go to pendingCommission, released monthly
- Withdrawal must pass backend validation:
  - sufficient wallet balance
  - bank details provided
  - amount within limits

---

# 5. AGENT COMMISSION RULES

- Each user may have an agentId
- Agent earns commission per contribution

RULES:

- Commission is calculated server-side only
- Commission is separate from savings balance
- Commission must be recorded in ledger
- Commission payout is independent wallet

---

# 6. ADMIN CHARGES RULES

Admin charges are calculated based on DAYS CONTRIBUTED, not per transaction.

RULES:

- **Charge Rate**: ₦50 per day contributed
- **Calculation**: Number of days = floor(contribution_amount / cycle_daily_amount)
- **Example**: If cycle is ₦1,000/day and user contributes ₦2,000:
  - Days calculated = floor(2000/1000) = 2 days
  - Admin charges = 2 × ₦50 = ₦100
  - Total amount user should transfer = ₦2,000 + ₦100 = ₦2,100

- **User Responsibility**: Users must include admin charges in their transfer amount
- **System Behavior**: If user sends insufficient amount:
  - After bank fees (~₦50), remaining amount may only cover partial days
  - Example: User sends ₦2,000 instead of ₦2,100 for 2-day contribution
  - After ₦50 bank fee: ₦1,950 available
  - Can only contribute for 1 day (₦1,000)
  - Remaining ₦950 goes to user's wallet
- **Applied before savings allocation**
- **Stored as ledger entry**
- **Immutable after transaction**

---

# 7. LEDGER RULES (CRITICAL)

- Ledger is the SINGLE SOURCE OF TRUTH

RULES:

- Append-only system
- No deletion or modification
- All balances derived from ledger
- Entries include:
  - deposit
  - withdrawal
  - charge
  - commission
  - adjustment

---

# 8. TRUST MODEL

- Backend is authoritative
- Frontend is display-only
- No financial logic in UI
