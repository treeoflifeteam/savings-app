# PAYMENT FLOW SYSTEM

---

# PAYMENT SOURCES

- Gmail API (email receipts)
- Monnify webhook (preferred)
- Manual admin verification (fallback)

---

# GMAIL DETECTION RULES

- Parse email content
- Match transaction patterns
- Extract:
  - amount
  - reference
  - sender
  - timestamp
- For direct bank transfers, try to match using:
  - unique code in payment narration
  - recipient account number
  - registered name from user profile
- If no match is found, move funds to a pending approval wallet and notify admin
- Pending payments are only processed after admin approval

---

# ADMIN CHARGES CALCULATION FOR BANK TRANSFERS

When users make bank transfers, they must include admin charges for accurate recording:

- **Formula**: Admin Charges = (Contribution Amount ÷ Daily Cycle Amount) × ₦50
- **Example**: User wants to contribute ₦2,000 to a ₦1,000/day cycle:
  - Days = floor(2000 ÷ 1000) = 2 days
  - Admin Charges = 2 × ₦50 = ₦100
  - Total Transfer Amount = ₦2,000 + ₦100 = ₦2,100

- **System Behavior on Insufficient Payment**:
  - If user transfers ₦2,000 instead of ₦2,100
  - After bank fees (~₦50): ₦1,950 available
  - Can only record 1 day contribution (₦1,000)
  - Remaining ₦950 goes to user's wallet

---

# VALIDATION FLOW

Email/Webhook → Backend Verification → Admin Charges Deduction → Ledger Entry → Savings Update

---

# RULE

Frontend NEVER confirms payment.
