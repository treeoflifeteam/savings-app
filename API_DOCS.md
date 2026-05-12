# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Routes (`/auth`)

### Register User

**POST** `/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "phone": "08012345678",
  "password": "securePassword"
}
```

Response:

```json
{
  "msg": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "phone": "08012345678",
    "walletBalance": 0,
    "currentCycle": null,
    "cycles": []
  }
}
```

### Login User

**POST** `/auth/login`

Request body:

```json
{
  "phone": "08012345678",
  "password": "securePassword"
}
```

Response:

```json
{
  "msg": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

---

## Savings Routes (`/savings`)

All routes require `Authorization: Bearer <token>` header.

### Get User Profile

**GET** `/savings/profile`

Response:

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "phone": "08012345678",
  "walletBalance": 50000,
  "currentCycle": {
    "dailyAmount": 5000,
    "totalDays": 30,
    "daysPaid": 10,
    "status": "active",
    "chargesTaken": true,
    "totalCharges": 2500,
    "startDate": "2024-05-01T10:00:00Z"
  },
  "cycles": []
}
```

### Start New Savings Cycle

**POST** `/savings/cycle/start`

Request body:

```json
{
  "dailyAmount": 5000,
  "totalDays": 30
}
```

Response:

```json
{
  "msg": "Savings cycle started successfully",
  "user": { ... }
}
```

### Add Savings

**POST** `/savings/savings/add`

Request body:

```json
{
  "days": 5,
  "method": "app" // "app" or "manual"
}
```

Response:

```json
{
  "msg": "Savings added successfully",
  "user": { ... }
}
```

### Withdraw Funds

**POST** `/savings/withdraw`

Request body:

```json
{
  "amount": 10000
}
```

Response:

```json
{
  "msg": "Withdrawal successful",
  "user": { ... }
}
```

### Get User Transactions

**GET** `/savings/transactions`

Response:

```json
[
  {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "deposit",
    "amount": 25000,
    "effect": 25000,
    "source": "app",
    "date": "2024-05-01T10:30:00Z"
  },
  {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "charge",
    "amount": 2500,
    "effect": -2500,
    "source": "app",
    "date": "2024-05-01T10:30:00Z"
  }
  // ... more transactions
]
```

---

## Admin Routes (Requires Authorization)

### Get All Users

**GET** `/savings/users`

Response:

```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "phone": "08012345678",
    "walletBalance": 50000,
    ...
  }
  // ... more users
]
```

### Get User by ID

**GET** `/savings/users/:userId`

Response:

```json
{
  "_id": "user_id",
  "name": "John Doe",
  ...
}
```

### Create User (Admin)

**POST** `/savings/admin/users/create`

Request body:

```json
{
  "name": "Jane Smith",
  "phone": "08087654321",
  "password": "optionalPassword" // Optional, defaults to "default123"
}
```

Response:

```json
{
  "msg": "User created successfully",
  "user": { ... }
}
```

### Get All Transactions (Admin)

**GET** `/savings/admin/transactions`

Response:

```json
[
  {
    "_id": "transaction_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "phone": "08012345678"
    },
    "type": "deposit",
    "amount": 25000,
    "effect": 25000,
    "source": "app",
    "date": "2024-05-01T10:30:00Z"
  }
  // ... more transactions
]
```

---

## Error Responses

All error responses follow this format:

```json
{
  "msg": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Authentication Header Format

For all protected routes, include:

```
Authorization: Bearer <your_jwt_token>
```

Or without Bearer prefix:

```
Authorization: <your_jwt_token>
```






