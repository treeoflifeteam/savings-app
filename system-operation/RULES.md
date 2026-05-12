# CODING STANDARDS

---

# GENERAL RULES

- Keep code modular
- No duplicated logic
- Prefer services over components logic

---

# FRONTEND RULES

- UI only
- No financial calculations
- Must call backend services for all logic

---

# BACKEND RULES

- All business logic lives here
- Services must be reusable
- Controllers must be thin

---

# NAMING CONVENTIONS

- services → camelCaseService
- controllers → camelCaseController
- files → kebab-case

---

# ANTI-PATTERNS

- No duplicate cycle logic
- No financial math in React
- No direct balance updates outside ledger