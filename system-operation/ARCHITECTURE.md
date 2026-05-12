# SAVINGS APP – SYSTEM ARCHITECTURE

## OVERVIEW

This is a financial-grade Savings & Contribution Management System.

It handles:

- User savings contributions
- Payment verification (Gmail API + gateway webhooks)
- Admin charges
- Agent commission system
- Withdrawals with approval flow
- Immutable ledger-based accounting

---

# HIGH LEVEL SYSTEM DESIGN

Frontend (React)
↓
Backend API (Node/Express)
↓
Core Services Layer
↓
Ledger System (Source of Truth)
↓
External Systems (Monnify, Gmail API)

---

# PAYMENT FLOW DETAILS

- Monnify webhook is preferred for instant gateway payments
- Gmail API is used to monitor direct bank deposit alerts
- Direct deposits are matched using unique narration codes, registered account numbers, and customer names
- Unmatched direct deposits are held in a pending approval wallet
- Admin approval is required before pending direct deposits are applied to savings
- Backend sends notifications to admin for all pending direct deposits

---

# FOLDER STRUCTURE

## FRONTEND (React)

src/
│
├── components/
│ ├── shared/
│ ├── dashboard/
│ └── savings/
│
├── pages/
│ ├── Dashboard.jsx
│ ├── Savings.jsx
│ └── Withdrawals.jsx
│
├── services/
│ ├── api.js
│ ├── savingsService.js
│ └── paymentService.js
│
├── hooks/
├── utils/
└── context/

---

## BACKEND (Node.js / Express)

src/
│
├── controllers/
│ ├── userController.js
│ ├── savingsController.js
│ ├── paymentController.js
│ └── withdrawalController.js
│
├── services/
│ ├── contributionService.js
│ ├── ledgerService.js
│ ├── paymentVerificationService.js
│ ├── commissionService.js
│ └── withdrawalService.js
│
├── models/
│ ├── User.js
│ ├── SavingsGroup.js
│ ├── Transaction.js
│ └── LedgerEntry.js
│
├── routes/
├── middleware/
└── utils/

---

# CORE DATA FLOW

1. User initiates contribution
2. Payment is made via gateway OR bank transfer
3. Gmail API / webhook detects payment
4. Backend verifies transaction
5. Ledger entry created
6. Charges applied
7. Savings balance updated
8. Agent commission calculated
9. Notification sent

---

# DESIGN PRINCIPLES

- Backend is source of truth
- Frontend is only UI layer
- Ledger is immutable
- All financial logic centralized in services
- No duplicate business logic in UI

---

# SYSTEM PRIORITY ORDER

1. Ledger integrity (HIGHEST)
2. Payment verification
3. Contribution logic
4. Withdrawals
5. Commission system
6. UI rendering (LOWEST)
