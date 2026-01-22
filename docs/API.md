# Frontend API Documentation

This backend is built on Supabase. We do not use REST endpoints; we use the Supabase JS Client.

## 📦 Data Models

### Money Handling
**IMPORTANT:** All monetary values are stored as **Integers in Cents**.
- Backend: `1050` (number)
- Frontend Display: `$10.50` (divide by 100)

### Account Types
- `checking`, `savings`, `credit_card`, `cash`

## 🛠 Service Layer (`src/services/`)

We have created helper functions to keep your components clean.

### Auth (`auth.ts`)
- `signUpUser(email, password, first, last)`: Creates Auth User + Public Profile.
- `loginUser(email, password)`
- `resetPassword(email)`

### Accounts (`accounts.ts`)
- `getAccounts()`: Returns list of user's accounts.
- `createAccount(name, type, balance)`: Adds new account.

### Transactions (`transactions.ts`)
- `addTransaction(accountId, amountCents, description, date)`
- `getRecentTransactions(limit)`

## 🚨 Error Handling
All service functions return a standardized object:
```ts
{
  data: any | null,
  error: string | null
}
```
Always check if (error) before using the data.
