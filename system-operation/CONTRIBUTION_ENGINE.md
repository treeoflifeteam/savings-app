# CONTRIBUTION ENGINE – CORE SYSTEM

This is the heart of the savings system.

---

# RESPONSIBILITY

Handles:

- contribution calculation
- cycle logic
- admin charges
- ledger creation
- commission triggers

---

# CORE FLOW

User Contribution Request
↓
Validate Cycle Type
↓
Compute Charge
↓
Apply Contribution Rules
↓
Create Ledger Entries
↓
Trigger Commission Engine
↓
Update Savings Balance

---

# DIRECT BANK TRANSFER HANDLING

- Direct bank deposits are detected via Gmail API alerts.
- If the transfer matches user metadata, it enters the normal contribution flow.
- If the transfer cannot be matched, it is held in a pending approval wallet.
- Pending direct deposits create a temporary pending ledger entry until admin approval.
- Pending direct deposits are only processed when an admin approves them.

---

# CYCLE ENGINE (IMPORTANT)

Instead of if/else logic:

BAD:
if (cycle === "daily") ...
if (cycle === "weekly") ...

GOOD:
CycleStrategy Pattern

---

# EXAMPLE STRUCTURE

const CycleStrategy = {
daily: () => {...},
weekly: () => {...},
monthly: () => {...},
fixed: () => {...}
}

---

# RULES

- No business logic in UI
- All computations in this engine
- Must be deterministic
- Must always produce ledger entries

---

# OUTPUT OF ENGINE

Every contribution returns:

{
userId,
amount,
charge,
netSavings,
ledgerEntries: [],
commission: {}
}

---

# DESIGN GOAL

Make system:

- predictable
- auditable
- extensible
- financial-grade safe
